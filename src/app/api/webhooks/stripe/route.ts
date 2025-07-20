import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { db } from '../../../../../db';
import { subscriptions, users } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

// This endpoint is NOT protected by Clerk middleware
// It needs to be accessible by Stripe for webhook events
// The webhook URL should be: http://localhost:3002/api/webhooks/stripe

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;
  
  if (!signature) {
    return NextResponse.json(
      { success: false, message: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }
  
  // Verify webhook signature
  let event;
  try {
    const stripe = getServerStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { success: false, message: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
  
  // Handle specific webhook events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get customer and subscription details
        const stripe = getServerStripe();
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const customerId = session.customer as string;
        
        // Get the clerkId from the session metadata
        const clerkId = session.metadata?.clerkId;
        
        if (!clerkId) {
          throw new Error('No clerkId found in session metadata');
        }
        
        // Find user by Clerk ID
        const userResult = await db.select()
          .from(users)
          .where(eq(users.clerkId, clerkId));
        
        if (!userResult || userResult.length === 0) {
          throw new Error(`User not found for Clerk ID: ${clerkId}`);
        }
        
        const user = userResult[0];
        
        // Create or update subscription record
        const existingSubscription = await db.select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, user.id));
        
        if (existingSubscription && existingSubscription.length > 0) {
          // Update existing subscription
          await db.update(subscriptions)
            .set({
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              plan: subscription.items.data[0].price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
              status: subscription.status,
              currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.userId, user.id));
        } else {
          // Create new subscription
          await db.insert(subscriptions)
            .values({
              userId: user.id,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              plan: subscription.items.data[0].price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
              status: subscription.status,
              currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            });
        }
        
        break;
      }
      
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find subscription by Stripe subscription ID
        const subscriptionResult = await db.select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
        
        if (!subscriptionResult || subscriptionResult.length === 0) {
          throw new Error(`Subscription not found for ID: ${subscription.id}`);
        }
        
        // Update subscription record
        await db.update(subscriptions)
          .set({
            status: subscription.status,
            currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find subscription by Stripe subscription ID
        const subscriptionResult = await db.select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
        
        if (!subscriptionResult || subscriptionResult.length === 0) {
          throw new Error(`Subscription not found for ID: ${subscription.id}`);
        }
        
        // Update subscription status to canceled
        await db.update(subscriptions)
          .set({
            status: 'canceled',
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
        
        break;
      }
    }
    
    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing webhook', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}