import { db } from '../../db';
import { users, subscriptions, reports } from '../../db/schema';
import { eq, and, gte, lt, desc, count, sql } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

/**
 * Check if a user has reached their daily free report limit
 * @returns boolean indicating if user has reached their limit
 */
export async function hasReachedDailyLimit(): Promise<boolean> {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    throw new Error('User not authenticated');
  }
  
  try {
    // Get user from database
    const userResult = await db.select()
      .from(users)
      .where(eq(users.clerkId, clerkId));
    
    if (!userResult || userResult.length === 0) {
      // User doesn't exist in database yet, they haven't reached any limit
      console.log(`User ${clerkId} not found in database, allowing report creation`);
      return false;
    }
    
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
    
    // If user has an active subscription, they have unlimited reports
    if (subscriptionResult && subscriptionResult.length > 0) {
      return false;
    }
    
    // Check if last report was created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // For testing: also reset if last report was more than 4 hours ago
    const fourHoursAgo = new Date();
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);
    
    // If last report date is not today OR was more than 4 hours ago, reset counter
    if (!user.lastReportDate || 
        new Date(user.lastReportDate) < today || 
        new Date(user.lastReportDate) < fourHoursAgo) {
      await db.update(users)
        .set({
          dailyReportsCount: 0,
          lastReportDate: new Date()
        })
        .where(eq(users.id, user.id));
      
      return false;
    }
    
    // Check if user has reached daily limit (3 free reports per day)
    return user.dailyReportsCount >= 3;
  } catch (error) {
    console.error('Error checking daily limit:', error);
    // On error, allow the report creation to prevent blocking users
    return false;
  }
}

/**
 * Increment user's daily report count
 */
export async function incrementDailyReportCount(): Promise<void> {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    throw new Error('User not authenticated');
  }

  try {
    // Get user from database
    const userResult = await db.select()
      .from(users)
      .where(eq(users.clerkId, clerkId));
    
    if (!userResult || userResult.length === 0) {
      // User doesn't exist in database yet, create them first
      console.log(`User ${clerkId} not found in database, creating user record`);
      await db.insert(users).values({
        clerkId: clerkId,
        email: `user-${clerkId}@example.com`, // Fallback email
        name: null,
        dailyReportsCount: 1,
        lastReportDate: new Date(),
      });
      return;
    }
    
    const user = userResult[0];
    
    // Update daily report count
    await db.update(users)
      .set({
        dailyReportsCount: user.dailyReportsCount + 1,
        lastReportDate: new Date()
      })
      .where(eq(users.id, user.id));
  } catch (error) {
    console.error('Error incrementing daily report count:', error);
    // Don't throw error to prevent blocking report creation
  }
}

/**
 * Get user's subscription status
 * @param userId Optional Clerk user ID. If not provided, will use the authenticated user.
 * @returns Object containing subscription status and details
 */
export async function getUserSubscriptionStatus(userId?: string) {
  const clerkId = userId || (await auth()).userId;
  
  if (!clerkId) {
    return { isSubscribed: false, plan: 'free', status: null, renewalDate: null, cancelAtPeriodEnd: false };
  }

  try {
    // Get user from database
    const userResult = await db.select()
      .from(users)
      .where(eq(users.clerkId, clerkId));
    
    if (!userResult || userResult.length === 0) {
      // User doesn't exist in database yet, return default free plan
      console.log(`User ${clerkId} not found in database, returning default free plan`);
      return { isSubscribed: false, plan: 'free', status: null, renewalDate: null, cancelAtPeriodEnd: false };
    }
    
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
    
    if (!subscriptionResult || subscriptionResult.length === 0) {
      return { isSubscribed: false, plan: 'free', status: null, renewalDate: null, cancelAtPeriodEnd: false };
    }
    
    const subscription = subscriptionResult[0];
    
    return {
      isSubscribed: true,
      plan: subscription.plan,
      status: subscription.status,
      renewalDate: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    };
  } catch (error) {
    console.error('Error fetching user subscription status:', error);
    // Return default free plan on error to prevent crashes
    return { isSubscribed: false, plan: 'free', status: null, renewalDate: null, cancelAtPeriodEnd: false };
  }
}