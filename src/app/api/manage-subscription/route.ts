import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../db';
import { users, subscriptions } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { action } = body;
    
    if (!action || (action !== 'cancel' && action !== 'reactivate')) {
      return NextResponse.json(
        { success: false, message: 'Invalid action specified' },
        { status: 400 }
      );
    }
    
    // Get user from database
    const userResult = await db.select()
      .from(users)
      .where(eq(users.clerkId, clerkId));
    
    if (!userResult || userResult.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found in database' },
        { status: 404 }
      );
    }
    
    const user = userResult[0];
    
    // Get user's active subscription
    const subscriptionResult = await db.select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, user.id),
          eq(subscriptions.status, 'active')
        )
      );
    
    if (!subscriptionResult || subscriptionResult.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No active subscription found' },
        { status: 404 }
      );
    }
    
    const subscription = subscriptionResult[0];
    
    // Get Stripe instance
    const stripe = getServerStripe();
    
    if (action === 'cancel') {
      // Cancel subscription at period end
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
      
      // Update subscription in database
      await db.update(subscriptions)
        .set({
          cancelAtPeriodEnd: true,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, subscription.id));
      
      return NextResponse.json({
        success: true,
        message: 'Subscription will be canceled at the end of the billing period',
      });
    } else if (action === 'reactivate') {
      // Reactivate subscription
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });
      
      // Update subscription in database
      await db.update(subscriptions)
        .set({
          cancelAtPeriodEnd: false,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, subscription.id));
      
      return NextResponse.json({
        success: true,
        message: 'Subscription has been reactivated',
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to manage subscription', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}