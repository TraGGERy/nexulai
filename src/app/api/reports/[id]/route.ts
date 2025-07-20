import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { reports, reportTypeEnum } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

// GET /api/reports/[id] - Get a specific report by ID
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Properly await params to avoid NextJS warning
    const params = await context.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid report ID'
      }, { status: 400 });
    }
    
    const report = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
    
    if (!report || report.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Report not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: report[0]
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch report',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT /api/reports/[id] - Update a specific report by ID
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Properly await params to avoid NextJS warning
    const params = await context.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid report ID'
      }, { status: 400 });
    }
    
    // Check if report exists
    const existingReport = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
    
    if (!existingReport || existingReport.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Report not found'
      }, { status: 404 });
    }
    
    const body = await request.json();
    const updateData: Record<string, unknown> = {};
    
    // Validate and add fields to update
    if (body.title !== undefined) {
      if (body.title.length < 3 || body.title.length > 100) {
        return NextResponse.json({
          success: false,
          message: 'Title must be between 3 and 100 characters'
        }, { status: 400 });
      }
      updateData.title = body.title;
    }
    
    if (body.type !== undefined) {
      const validTypes = reportTypeEnum.enumValues;
      if (!validTypes.includes(body.type as typeof reportTypeEnum.enumValues[number])) {
        return NextResponse.json({
          success: false,
          message: `Invalid report type. Valid types are: ${validTypes.join(', ')}`
        }, { status: 400 });
      }
      updateData.type = body.type;
    }
    
    if (body.content !== undefined) {
      if (typeof body.content !== 'object' || body.content === null) {
        return NextResponse.json({
          success: false,
          message: 'Content must be a valid JSON object'
        }, { status: 400 });
      }
      updateData.content = body.content;
    }
    
    // Add updatedAt timestamp
    updateData.updatedAt = new Date();
    
    // Update the report
    const updatedReport = await db.update(reports)
      .set(updateData)
      .where(eq(reports.id, id))
      .returning();
    
    return NextResponse.json({
      success: true,
      message: 'Report updated successfully',
      data: updatedReport[0]
    });
  } catch (error) {
    console.error('Error updating report:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update report',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE /api/reports/[id] - Delete a specific report by ID
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Properly await params to avoid NextJS warning
    const params = await context.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid report ID'
      }, { status: 400 });
    }
    
    // Check if report exists
    const existingReport = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
    
    if (!existingReport || existingReport.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Report not found'
      }, { status: 404 });
    }
    
    // Delete the report
    await db.delete(reports).where(eq(reports.id, id));
    
    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete report',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}