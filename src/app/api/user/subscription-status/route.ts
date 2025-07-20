import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { users, subscriptions } from '../../../../../db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's subscription status directly
    const userResult = await db.select()
      .from(users)
      .where(eq(users.clerkId, userId));
    
    let subscriptionStatus = {
      isSubscribed: false,
      plan: 'free',
      status: null as string | null,
      renewalDate: null as Date | null,
      cancelAtPeriodEnd: false,
      dailyReportsCount: 0,
      dailyReportsLimit: 3
    };

    if (userResult && userResult.length > 0) {
      const user = userResult[0];
      
      // Check if user has an active subscription
      const subscriptionResult = await db.select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.userId, user.id),
            eq(subscriptions.status, 'active')
          )
        );
      
      if (subscriptionResult && subscriptionResult.length > 0) {
        const subscription = subscriptionResult[0];
        subscriptionStatus = {
          isSubscribed: true,
          plan: subscription.plan,
          status: subscription.status,
          renewalDate: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          dailyReportsCount: user.dailyReportsCount || 0,
          dailyReportsLimit: subscription.plan === 'free' ? 3 : Infinity
        };
      } else {
        subscriptionStatus.dailyReportsCount = user.dailyReportsCount || 0;
      }
    }

    // Calculate daily reports left
    let dailyReportsLeft = subscriptionStatus.dailyReportsLimit;
    
    if (!subscriptionStatus.isSubscribed) {
      // Free users have a limit of 3 reports per day
      dailyReportsLeft = Math.max(0, 3 - subscriptionStatus.dailyReportsCount);
    }

    return NextResponse.json({
      ...subscriptionStatus,
      dailyReportsLeft
    });
  } catch (error) {
    console.error('Error fetching user subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}