import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { reports, reportTypeEnum, users, userReports } from '../../../../db/schema';
import { desc, eq, count } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { hasReachedDailyLimit, incrementDailyReportCount } from '@/lib/subscription-utils';

// GET /api/reports - Get all reports with optional pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type');
    
    // Validate type if provided
    const validTypes = reportTypeEnum.enumValues;
    if (type && !validTypes.includes(type as typeof reportTypeEnum.enumValues[number])) {
      return NextResponse.json({
        success: false,
        message: `Invalid report type. Valid types are: ${validTypes.join(', ')}`
      }, { status: 400 });
    }
    
    // Build where condition if type filter is provided
    const whereConditions = [];
    if (type) {
      whereConditions.push(eq(reports.type, type as typeof reportTypeEnum.enumValues[number]));
    }
    
    // Execute query with or without filter
    const allReports = await db.select()
      .from(reports)
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)
      .orderBy(desc(reports.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Get total count with the same filter
    const totalCountResult = await db.select({ count: count() })
      .from(reports)
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined);
    
    return NextResponse.json({
      success: true,
      data: allReports,
      pagination: {
        limit,
        offset,
        total: Number(totalCountResult[0]?.count) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch reports',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST /api/reports - Create a new report
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
    
    let user;
    if (!userResult || userResult.length === 0) {
      // User doesn't exist in database yet, create them first
      console.log(`User ${clerkId} not found in database, creating user record`);
      const newUserResult = await db.insert(users).values({
        clerkId: clerkId,
        email: `user-${clerkId}@example.com`, // Fallback email
        name: null,
        dailyReportsCount: 0,
        lastReportDate: null,
      }).returning();
      user = newUserResult[0];
    } else {
      user = userResult[0];
    }
    
    // Check if user has reached daily limit
    const hasReachedLimit = await hasReachedDailyLimit();
    
    if (hasReachedLimit) {
      return NextResponse.json({
        success: false,
        message: 'You have reached your daily limit of 3 free reports. Please upgrade to a paid plan for unlimited reports.'
      }, { status: 403 });
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.type || !body.content) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: title, type, and content are required'
      }, { status: 400 });
    }
    
    // Validate report type
    const validTypes = reportTypeEnum.enumValues;
    console.log('Validating report type:', { 
      receivedType: body.type, 
      validTypes: validTypes,
      isValid: validTypes.includes(body.type)
    });
    
    if (!validTypes.includes(body.type)) {
      console.error(`Invalid report type: '${body.type}'. Valid types are: ${validTypes.join(', ')}`);
      return NextResponse.json({
        success: false,
        message: `Invalid report type: '${body.type}'. Valid types are: ${validTypes.join(', ')}`
      }, { status: 400 });
    }
    
    // Validate title length
    if (body.title.length < 3 || body.title.length > 100) {
      return NextResponse.json({
        success: false,
        message: 'Title must be between 3 and 100 characters'
      }, { status: 400 });
    }
    
    // Validate content is an object
    if (typeof body.content !== 'object' || body.content === null) {
      return NextResponse.json({
        success: false,
        message: 'Content must be a valid JSON object'
      }, { status: 400 });
    }
    
    // Insert the report into the database
    const newReport = await db.insert(reports).values({
      title: body.title,
      type: body.type,
      content: body.content,
      userId: user.id,
    }).returning();
    
    // Increment user's daily report count
    await incrementDailyReportCount();
    
    // Create user-report relationship
    await db.insert(userReports).values({
      userId: user.id,
      reportId: newReport[0].id,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Report created successfully',
      data: newReport[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create report',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}