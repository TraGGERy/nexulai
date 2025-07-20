import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { reports } from '../../../../db/schema';

export async function GET() {
  try {
    // Try to select one record from the reports table
    const result = await db.select().from(reports).limit(1);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: result
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}