import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../db';
import { users } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

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
    const { plan } = body;
    
    if (!plan || (plan !== 'monthly' && plan !== 'yearly')) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan specified' },
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
    
    // Get price ID based on selected plan
    const priceId = plan === 'monthly' ? SUBSCRIPTION_PLANS.MONTHLY : SUBSCRIPTION_PLANS.YEARLY;
    
    // Get Stripe instance
    const stripe = getServerStripe();
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/pricing?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id.toString(),
        clerkId,
      },
    });
    
    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create checkout session', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}