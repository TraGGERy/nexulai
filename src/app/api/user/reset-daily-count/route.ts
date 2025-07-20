import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { users } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// POST /api/user/reset-daily-count - Reset user's daily report count (for testing)
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated'
      }, { status: 401 });
    }
    
    // Get user from database
    const userResult = await db.select()
      .from(users)
      .where(eq(users.clerkId, clerkId));
    
    if (!userResult || userResult.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found in database'
      }, { status: 404 });
    }
    
    const user = userResult[0];
    
    // Reset daily report count
    await db.update(users)
      .set({
        dailyReportsCount: 0,
        lastReportDate: new Date()
      })
      .where(eq(users.id, user.id));
    
    return NextResponse.json({
      success: true,
      message: 'Daily report count reset successfully',
      data: {
        previousCount: user.dailyReportsCount,
        newCount: 0
      }
    });
  } catch (error) {
    console.error('Error resetting daily count:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to reset daily count',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}