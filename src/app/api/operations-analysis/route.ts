import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../db';
import { users, reports, userReports } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { hasReachedDailyLimit, incrementDailyReportCount } from '@/lib/subscription-utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
        message: 'User not found'
      }, { status: 404 });
    }

    const user = userResult[0];

    // Check daily limits
    const hasReachedLimit = await hasReachedDailyLimit();
    if (hasReachedLimit) {
      return NextResponse.json({
        success: false,
        message: 'Daily analysis limit reached. Please upgrade your plan or try again tomorrow.'
      }, { status: 429 });
    }

    const requestData = await request.json();
    const {
      company,
      department,
      analysisType,
      operationalScope,
      timeframe,
      specificChallenges,
      currentProcesses,
      performanceMetrics,
      improvementGoals,
      budgetConstraints,
      specificFocus
    } = requestData;

    // Alias for backward compatibility
    const currentChallenges = specificChallenges;

    // Validate required fields
    if (!company || !department || !analysisType) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: company, department, and analysisType are required'
      }, { status: 400 });
    }

    // Create comprehensive operations analysis prompt
    const prompt = `
IMPORTANT: Your final response MUST be formatted as a valid, parseable JSON object following the schema provided at the end of this prompt. Do not include any text outside the JSON structure.

You are a senior operations consultant with expertise in process optimization, efficiency improvement, and operational excellence. Generate a detailed operations analysis report based on the following parameters:

ANALYSIS PARAMETERS:
- Company: ${company}
- Department/Function: ${department}
- Analysis Type: ${analysisType}
- Operational Scope: ${operationalScope || 'Full department'}
- Timeframe: ${timeframe || '12 months'}
- Specific Challenges: ${specificChallenges || 'General operational efficiency'}
- Current Processes: ${currentProcesses || 'Standard industry processes'}
- Performance Metrics: ${performanceMetrics || 'Standard KPIs'}
- Improvement Goals: ${improvementGoals || 'Increase efficiency and reduce costs'}

ANALYSIS TYPES AVAILABLE:
1. Process Optimization & Efficiency
2. Supply Chain Analysis
3. Quality Management Assessment
4. Cost Reduction Analysis
5. Workflow & Productivity Analysis
6. Technology Integration Assessment
7. Resource Allocation Optimization
8. Performance Management Analysis
9. Risk & Compliance Assessment
10. Digital Transformation Readiness

Generate a comprehensive operations analysis report that includes:

1. EXECUTIVE SUMMARY
   - Current operational state assessment
   - Key inefficiencies identified
   - Improvement potential and ROI projections

2. CURRENT STATE ANALYSIS
   - Process mapping and workflow analysis
   - Performance metrics baseline
   - Resource utilization assessment
   - Technology and systems evaluation

3. OPERATIONAL CHALLENGES
   - Identified bottlenecks and pain points
   - Root cause analysis
   - Impact assessment on business objectives
   - Risk factors and compliance issues

4. EFFICIENCY OPPORTUNITIES
   - Process improvement opportunities
   - Automation potential
   - Resource optimization areas
   - Technology enhancement possibilities

5. PERFORMANCE METRICS & KPIs
   - Current performance indicators
   - Benchmark comparisons
   - Target performance levels
   - Measurement frameworks

6. IMPROVEMENT RECOMMENDATIONS
   - Process redesign recommendations
   - Technology solutions
   - Resource reallocation strategies
   - Training and development needs

7. IMPLEMENTATION ROADMAP
   - Quick wins (0-90 days)
   - Short-term improvements (3-12 months)
   - Long-term transformation (1-3 years)
   - Change management strategy

8. COST-BENEFIT ANALYSIS
   - Investment requirements
   - Expected cost savings
   - ROI projections
   - Payback period analysis

Ensure the analysis is:
- Data-driven with specific metrics and benchmarks
- Actionable with clear implementation steps
- Comprehensive covering all operational aspects
- Professional and suitable for executive presentation
- Include specific numbers, percentages, and projections where applicable

REQUIRED JSON RESPONSE SCHEMA:
{
  "executiveSummary": {
    "currentState": "assessment of current operational state",
    "keyInefficiencies": ["inefficiency1", "inefficiency2", "inefficiency3"],
    "improvementPotential": "percentage or description",
    "projectedROI": "ROI percentage and timeframe"
  },
  "currentStateAnalysis": {
    "processMapping": {
      "keyProcesses": [
        {
          "process": "process name",
          "efficiency": "percentage",
          "bottlenecks": ["bottleneck1", "bottleneck2"],
          "duration": "time taken",
          "resources": "resources required"
        }
      ],
      "overallEfficiency": "percentage"
    },
    "performanceMetrics": {
      "productivity": "current level",
      "quality": "current level",
      "costEfficiency": "current level",
      "customerSatisfaction": "current level"
    },
    "resourceUtilization": {
      "humanResources": "utilization percentage",
      "technology": "utilization percentage",
      "facilities": "utilization percentage",
      "equipment": "utilization percentage"
    },
    "technologyAssessment": {
      "currentSystems": ["system1", "system2"],
      "integrationLevel": "high/medium/low",
      "automationLevel": "percentage",
      "digitalMaturity": "advanced/intermediate/basic"
    }
  },
  "operationalChallenges": {
    "bottlenecks": [
      {
        "area": "area name",
        "description": "detailed description",
        "impact": "high/medium/low",
        "rootCause": "root cause analysis",
        "affectedProcesses": ["process1", "process2"]
      }
    ],
    "inefficiencies": [
      {
        "type": "inefficiency type",
        "description": "description",
        "costImpact": "monetary impact",
        "frequency": "how often it occurs"
      }
    ],
    "riskFactors": [
      {
        "risk": "risk description",
        "probability": "high/medium/low",
        "impact": "high/medium/low",
        "mitigation": "mitigation strategy"
      }
    ]
  },
  "efficiencyOpportunities": {
    "processImprovements": [
      {
        "process": "process name",
        "currentEfficiency": "percentage",
        "targetEfficiency": "percentage",
        "improvementActions": ["action1", "action2"],
        "estimatedSavings": "cost savings"
      }
    ],
    "automationPotential": [
      {
        "area": "area name",
        "automationLevel": "percentage possible",
        "technology": "required technology",
        "implementation": "complexity level",
        "benefits": ["benefit1", "benefit2"]
      }
    ],
    "resourceOptimization": [
      {
        "resource": "resource type",
        "currentUtilization": "percentage",
        "optimizedUtilization": "percentage",
        "actions": ["action1", "action2"]
      }
    ]
  },
  "performanceMetrics": {
    "currentKPIs": [
      {
        "metric": "KPI name",
        "currentValue": "current value",
        "benchmark": "industry benchmark",
        "target": "target value",
        "gap": "performance gap"
      }
    ],
    "proposedKPIs": [
      {
        "metric": "new KPI name",
        "purpose": "why this KPI",
        "target": "target value",
        "measurement": "how to measure"
      }
    ]
  },
  "improvementRecommendations": {
    "processRedesign": [
      {
        "process": "process name",
        "currentState": "description",
        "proposedState": "description",
        "benefits": ["benefit1", "benefit2"],
        "implementation": "steps required"
      }
    ],
    "technologySolutions": [
      {
        "solution": "technology solution",
        "purpose": "what it solves",
        "implementation": "implementation approach",
        "cost": "estimated cost",
        "benefits": ["benefit1", "benefit2"]
      }
    ],
    "organizationalChanges": [
      {
        "change": "organizational change",
        "rationale": "why needed",
        "implementation": "how to implement",
        "impact": "expected impact"
      }
    ]
  },
  "implementationRoadmap": {
    "quickWins": [
      {
        "initiative": "initiative name",
        "description": "what to do",
        "timeline": "0-90 days",
        "resources": "required resources",
        "expectedBenefit": "expected outcome",
        "kpis": ["kpi1", "kpi2"]
      }
    ],
    "shortTerm": [
      {
        "initiative": "initiative name",
        "description": "what to do",
        "timeline": "3-12 months",
        "resources": "required resources",
        "expectedBenefit": "expected outcome",
        "dependencies": ["dependency1", "dependency2"]
      }
    ],
    "longTerm": [
      {
        "initiative": "initiative name",
        "description": "what to do",
        "timeline": "1-3 years",
        "resources": "required resources",
        "expectedBenefit": "expected outcome",
        "strategicImpact": "long-term impact"
      }
    ]
  },
  "costBenefitAnalysis": {
    "investmentRequired": {
      "technology": "cost amount",
      "training": "cost amount",
      "consulting": "cost amount",
      "infrastructure": "cost amount",
      "total": "total investment"
    },
    "expectedSavings": {
      "annual": "annual savings",
      "threeYear": "three year savings",
      "fiveYear": "five year savings"
    },
    "roiProjections": {
      "yearOne": "ROI percentage",
      "yearTwo": "ROI percentage",
      "yearThree": "ROI percentage",
      "paybackPeriod": "months to payback"
    }
  },
  "metadata": {
    "analysisDate": "current date",
    "analyst": "AI Operations Consultant",
    "reportType": "Operations Analysis",
    "version": "1.0"
  }
}`;

    // Generate operations analysis using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior operations consultant with expertise in process optimization, efficiency improvement, and operational excellence. You provide data-driven insights and actionable recommendations for operational improvements."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const analysisContent = completion.choices[0].message.content;

    if (!analysisContent) {
      return NextResponse.json({
        success: false,
        message: 'Failed to generate operations analysis'
      }, { status: 500 });
    }

    // Parse the JSON response
    let analysisData;
    try {
      analysisData = JSON.parse(analysisContent);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to parse analysis results'
      }, { status: 500 });
    }

    // Increment daily report count
    await incrementDailyReportCount();

    // Save the report to the database
    const reportTitle = `Operations Analysis - ${company} (${analysisType})`;
    const newReport = await db.insert(reports).values({
      title: reportTitle,
      type: 'operations',
      content: {
        analysis: analysisData,
        requestParameters: {
          company,
          analysisType,
          department,
          operationalScope,
          timeframe,
          currentChallenges,
          performanceMetrics,
          improvementGoals,
          budgetConstraints,
          specificFocus
        },
        generatedAt: new Date().toISOString(),
        analysisId: `OPS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      userId: user.id,
    }).returning();

    // Create user-report relationship
    await db.insert(userReports).values({
      userId: user.id,
      reportId: newReport[0].id,
    });

    return NextResponse.json({
      success: true,
      message: 'Operations analysis generated and saved successfully',
      data: {
        reportId: newReport[0].id,
        analysis: analysisData,
        requestParameters: {
          company,
          analysisType,
          department,
          operationalScope,
          timeframe,
          currentChallenges,
          performanceMetrics,
          improvementGoals,
          budgetConstraints,
          specificFocus
        },
        generatedAt: new Date().toISOString(),
        analysisId: `OPS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });

  } catch (error) {
    console.error('Operations Analysis API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error occurred while generating operations analysis'
    }, { status: 500 });
  }
}

// GET endpoint for retrieving analysis types and capabilities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const info = searchParams.get('info');

    if (info === 'capabilities') {
      return NextResponse.json({
        success: true,
        data: {
          analysisTypes: [
            {
              id: 'process-optimization',
              name: 'Process Optimization & Efficiency',
              description: 'Comprehensive analysis of business processes to identify optimization opportunities',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Process efficiency', 'Bottlenecks', 'Resource utilization', 'Improvement opportunities']
            },
            {
              id: 'supply-chain',
              name: 'Supply Chain Analysis',
              description: 'End-to-end supply chain assessment and optimization recommendations',
              estimatedTime: '25-30 minutes',
              dataPoints: ['Supply chain efficiency', 'Vendor performance', 'Logistics optimization', 'Cost analysis']
            },
            {
              id: 'quality-management',
              name: 'Quality Management Assessment',
              description: 'Quality systems evaluation and improvement recommendations',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Quality metrics', 'Defect rates', 'Process controls', 'Compliance assessment']
            },
            {
              id: 'cost-reduction',
              name: 'Cost Reduction Analysis',
              description: 'Systematic analysis to identify cost reduction opportunities',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Cost structure', 'Savings opportunities', 'ROI analysis', 'Implementation roadmap']
            },
            {
              id: 'workflow-productivity',
              name: 'Workflow & Productivity Analysis',
              description: 'Workflow optimization and productivity enhancement strategies',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Workflow efficiency', 'Productivity metrics', 'Resource allocation', 'Performance gaps']
            },
            {
              id: 'technology-integration',
              name: 'Technology Integration Assessment',
              description: 'Technology systems evaluation and integration recommendations',
              estimatedTime: '25-30 minutes',
              dataPoints: ['System integration', 'Automation potential', 'Digital maturity', 'Technology roadmap']
            },
            {
              id: 'resource-allocation',
              name: 'Resource Allocation Optimization',
              description: 'Optimal allocation of human, financial, and physical resources',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Resource utilization', 'Allocation efficiency', 'Capacity planning', 'Optimization strategies']
            },
            {
              id: 'performance-management',
              name: 'Performance Management Analysis',
              description: 'Performance measurement systems and improvement strategies',
              estimatedTime: '20-25 minutes',
              dataPoints: ['KPI effectiveness', 'Performance gaps', 'Measurement systems', 'Improvement plans']
            },
            {
              id: 'risk-compliance',
              name: 'Risk & Compliance Assessment',
              description: 'Operational risk assessment and compliance evaluation',
              estimatedTime: '25-30 minutes',
              dataPoints: ['Risk factors', 'Compliance status', 'Mitigation strategies', 'Control systems']
            },
            {
              id: 'digital-transformation',
              name: 'Digital Transformation Readiness',
              description: 'Assessment of digital transformation readiness and roadmap',
              estimatedTime: '25-30 minutes',
              dataPoints: ['Digital maturity', 'Transformation opportunities', 'Implementation strategy', 'Change management']
            }
          ],
          departments: [
            'Operations',
            'Manufacturing',
            'Supply Chain',
            'Logistics',
            'Quality Assurance',
            'Customer Service',
            'Human Resources',
            'Information Technology',
            'Finance & Accounting',
            'Sales',
            'Marketing',
            'Research & Development',
            'Procurement',
            'Facilities Management',
            'Other'
          ],
          operationalScopes: [
            'Single Process',
            'Department-wide',
            'Cross-functional',
            'Division-wide',
            'Company-wide',
            'Multi-location',
            'Global Operations',
            'Custom Scope'
          ],
          timeframes: [
            '3 months',
            '6 months',
            '12 months',
            '18 months',
            '2 years',
            '3 years',
            'Custom timeframe'
          ],
          performanceMetrics: [
            'Efficiency Ratios',
            'Productivity Metrics',
            'Quality Indicators',
            'Cost Metrics',
            'Time-based Metrics',
            'Customer Satisfaction',
            'Employee Performance',
            'Resource Utilization',
            'Process Cycle Time',
            'Error Rates',
            'Compliance Metrics',
            'Custom Metrics'
          ]
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Operations Analysis AI API is operational',
      endpoints: {
        'POST /api/operations-analysis': 'Generate operations analysis',
        'GET /api/operations-analysis?info=capabilities': 'Get available analysis types and options'
      },
      version: '1.0.0'
    });

  } catch (error) {
    console.error('Operations Analysis API GET Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}