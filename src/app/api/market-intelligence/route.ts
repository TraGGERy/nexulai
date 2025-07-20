import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../db';
import { users } from '../../../../db/schema';
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
      industry,
      analysisType,
      geographicScope,
      timeframe,
      specificQuestions,
      competitorList,
      dataPoints
    } = requestData;

    // Validate required fields
    if (!company || !industry || !analysisType) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: company, industry, and analysisType are required'
      }, { status: 400 });
    }

    // Create comprehensive market intelligence prompt
    const prompt = `
IMPORTANT: Your final response MUST be formatted as a valid, parseable JSON object following the schema provided at the end of this prompt. Do not include any text outside the JSON structure.

You are a senior market intelligence analyst with access to comprehensive market data and competitive intelligence. Generate a detailed market intelligence report based on the following parameters:

ANALYSIS PARAMETERS:
- Company: ${company}
- Industry: ${industry}
- Analysis Type: ${analysisType}
- Geographic Scope: ${geographicScope || 'Global'}
- Timeframe: ${timeframe || '12 months'}
- Specific Questions: ${specificQuestions || 'General market analysis'}
- Competitors: ${competitorList || 'Industry leaders'}
- Key Data Points: ${dataPoints || 'Market size, growth, trends'}

ANALYSIS TYPES AVAILABLE:
1. Market Size & Growth Analysis
2. Competitive Landscape Assessment
3. Industry Trend Analysis
4. Customer Behavior Insights
5. Market Entry Strategy
6. Threat & Opportunity Assessment
7. Pricing Analysis
8. Technology Disruption Impact
9. Regulatory Environment Analysis
10. Supply Chain Intelligence

Generate a comprehensive market intelligence report that includes:

1. EXECUTIVE SUMMARY
   - Key findings and insights
   - Critical market dynamics
   - Strategic implications

2. MARKET OVERVIEW
   - Market size and growth projections
   - Key market segments
   - Geographic distribution
   - Market maturity assessment

3. COMPETITIVE LANDSCAPE
   - Major players and market share
   - Competitive positioning
   - Strengths and weaknesses analysis
   - Recent competitive moves

4. INDUSTRY TRENDS
   - Emerging trends and patterns
   - Technology disruptions
   - Consumer behavior shifts
   - Regulatory changes

5. OPPORTUNITIES & THREATS
   - Market opportunities
   - Potential threats
   - Risk assessment
   - Mitigation strategies

6. CUSTOMER INSIGHTS
   - Target customer segments
   - Customer needs and preferences
   - Buying behavior patterns
   - Price sensitivity analysis

7. STRATEGIC RECOMMENDATIONS
   - Market entry/expansion strategies
   - Competitive positioning recommendations
   - Investment priorities
   - Timeline for implementation

8. DATA SOURCES & METHODOLOGY
   - Primary data sources
   - Research methodology
   - Data reliability assessment
   - Limitations and assumptions

Ensure the analysis is:
- Data-driven with specific metrics and projections
- Actionable with clear strategic recommendations
- Comprehensive covering all relevant market aspects
- Professional and suitable for executive presentation
- Include specific numbers, percentages, and forecasts where applicable

REQUIRED JSON RESPONSE SCHEMA:
{
  "executiveSummary": {
    "keyFindings": ["finding1", "finding2", "finding3"],
    "criticalDynamics": ["dynamic1", "dynamic2"],
    "strategicImplications": ["implication1", "implication2"]
  },
  "marketOverview": {
    "marketSize": {
      "current": "value with currency",
      "projected": "value with currency",
      "growthRate": "percentage",
      "timeframe": "period"
    },
    "keySegments": [
      {
        "name": "segment name",
        "size": "market size",
        "growth": "growth rate"
      }
    ],
    "geographicDistribution": [
      {
        "region": "region name",
        "marketShare": "percentage",
        "growth": "growth rate"
      }
    ],
    "maturityLevel": "emerging/growth/mature/declining"
  },
  "competitiveLandscape": {
    "majorPlayers": [
      {
        "company": "company name",
        "marketShare": "percentage",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "recentMoves": ["move1", "move2"]
      }
    ],
    "competitiveIntensity": "low/medium/high",
    "barrierToEntry": "low/medium/high"
  },
  "industryTrends": {
    "emergingTrends": [
      {
        "trend": "trend name",
        "impact": "high/medium/low",
        "timeframe": "short/medium/long term",
        "description": "detailed description"
      }
    ],
    "technologyDisruptions": [
      {
        "technology": "tech name",
        "disruptionLevel": "high/medium/low",
        "adoptionTimeline": "timeline",
        "impact": "description"
      }
    ],
    "regulatoryChanges": [
      {
        "regulation": "regulation name",
        "impact": "positive/negative/neutral",
        "timeline": "implementation timeline",
        "description": "description"
      }
    ]
  },
  "opportunitiesThreats": {
    "opportunities": [
      {
        "opportunity": "opportunity name",
        "potential": "high/medium/low",
        "timeframe": "short/medium/long term",
        "requirements": ["requirement1", "requirement2"]
      }
    ],
    "threats": [
      {
        "threat": "threat name",
        "severity": "high/medium/low",
        "probability": "high/medium/low",
        "mitigationStrategies": ["strategy1", "strategy2"]
      }
    ]
  },
  "customerInsights": {
    "targetSegments": [
      {
        "segment": "segment name",
        "size": "segment size",
        "characteristics": ["char1", "char2"],
        "needs": ["need1", "need2"],
        "priceSensitivity": "high/medium/low"
      }
    ],
    "buyingBehavior": {
      "decisionFactors": ["factor1", "factor2"],
      "purchaseProcess": "description",
      "seasonality": "seasonal patterns"
    }
  },
  "strategicRecommendations": {
    "immediate": [
      {
        "action": "action description",
        "priority": "high/medium/low",
        "timeline": "timeframe",
        "resources": "required resources",
        "expectedOutcome": "expected result"
      }
    ],
    "shortTerm": [
      {
        "action": "action description",
        "priority": "high/medium/low",
        "timeline": "timeframe",
        "resources": "required resources",
        "expectedOutcome": "expected result"
      }
    ],
    "longTerm": [
      {
        "action": "action description",
        "priority": "high/medium/low",
        "timeline": "timeframe",
        "resources": "required resources",
        "expectedOutcome": "expected result"
      }
    ]
  },
  "methodology": {
    "dataSources": ["source1", "source2"],
    "researchMethods": ["method1", "method2"],
    "limitations": ["limitation1", "limitation2"],
    "confidenceLevel": "high/medium/low"
  },
  "metadata": {
    "analysisDate": "current date",
    "analyst": "AI Market Intelligence System",
    "reportType": "Market Intelligence Analysis",
    "version": "1.0"
  }
}`;

    // Generate market intelligence analysis using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior market intelligence analyst with expertise in comprehensive market research and competitive analysis. You provide data-driven insights and strategic recommendations based on thorough market analysis."
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
        message: 'Failed to generate market intelligence analysis'
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

    return NextResponse.json({
      success: true,
      message: 'Market intelligence analysis generated successfully',
      data: {
        analysis: analysisData,
        requestParameters: {
          company,
          industry,
          analysisType,
          geographicScope,
          timeframe,
          specificQuestions,
          competitorList,
          dataPoints
        },
        generatedAt: new Date().toISOString(),
        analysisId: `MI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });

  } catch (error) {
    console.error('Market Intelligence API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error occurred while generating market intelligence analysis'
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
              id: 'market-size-growth',
              name: 'Market Size & Growth Analysis',
              description: 'Comprehensive analysis of market size, growth projections, and key drivers',
              estimatedTime: '15-20 minutes',
              dataPoints: ['Market size', 'Growth rate', 'Market segments', 'Geographic distribution']
            },
            {
              id: 'competitive-landscape',
              name: 'Competitive Landscape Assessment',
              description: 'Detailed analysis of competitors, market positioning, and competitive dynamics',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Market share', 'Competitor profiles', 'Competitive advantages', 'Strategic moves']
            },
            {
              id: 'industry-trends',
              name: 'Industry Trend Analysis',
              description: 'Identification and analysis of emerging trends and market patterns',
              estimatedTime: '15-20 minutes',
              dataPoints: ['Emerging trends', 'Technology disruptions', 'Consumer behavior', 'Regulatory changes']
            },
            {
              id: 'customer-insights',
              name: 'Customer Behavior Insights',
              description: 'Deep dive into customer segments, preferences, and buying behavior',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Customer segments', 'Buying patterns', 'Preferences', 'Price sensitivity']
            },
            {
              id: 'market-entry',
              name: 'Market Entry Strategy',
              description: 'Strategic analysis for entering new markets or expanding existing presence',
              estimatedTime: '25-30 minutes',
              dataPoints: ['Entry barriers', 'Market attractiveness', 'Entry strategies', 'Risk assessment']
            },
            {
              id: 'threat-opportunity',
              name: 'Threat & Opportunity Assessment',
              description: 'Comprehensive analysis of market opportunities and potential threats',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Market opportunities', 'Threat analysis', 'Risk factors', 'Mitigation strategies']
            },
            {
              id: 'pricing-analysis',
              name: 'Pricing Analysis',
              description: 'Market pricing dynamics, competitive pricing, and pricing strategy recommendations',
              estimatedTime: '15-20 minutes',
              dataPoints: ['Price benchmarks', 'Pricing strategies', 'Price elasticity', 'Value perception']
            },
            {
              id: 'technology-disruption',
              name: 'Technology Disruption Impact',
              description: 'Analysis of how emerging technologies are disrupting the market',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Disruptive technologies', 'Adoption rates', 'Impact assessment', 'Strategic implications']
            },
            {
              id: 'regulatory-environment',
              name: 'Regulatory Environment Analysis',
              description: 'Analysis of regulatory landscape and its impact on market dynamics',
              estimatedTime: '15-20 minutes',
              dataPoints: ['Regulatory framework', 'Compliance requirements', 'Policy changes', 'Impact analysis']
            },
            {
              id: 'supply-chain',
              name: 'Supply Chain Intelligence',
              description: 'Analysis of supply chain dynamics, risks, and optimization opportunities',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Supply chain structure', 'Risk factors', 'Optimization opportunities', 'Cost analysis']
            }
          ],
          geographicScopes: [
            'Global',
            'North America',
            'Europe',
            'Asia-Pacific',
            'Latin America',
            'Middle East & Africa',
            'United States',
            'European Union',
            'China',
            'India',
            'Custom Region'
          ],
          timeframes: [
            '6 months',
            '12 months',
            '18 months',
            '2 years',
            '3 years',
            '5 years',
            'Custom timeframe'
          ],
          industries: [
            'Technology',
            'Healthcare',
            'Financial Services',
            'Retail & E-commerce',
            'Manufacturing',
            'Energy & Utilities',
            'Telecommunications',
            'Automotive',
            'Real Estate',
            'Media & Entertainment',
            'Food & Beverage',
            'Transportation & Logistics',
            'Education',
            'Government',
            'Non-profit',
            'Other'
          ]
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Market Intelligence AI API is operational',
      endpoints: {
        'POST /api/market-intelligence': 'Generate market intelligence analysis',
        'GET /api/market-intelligence?info=capabilities': 'Get available analysis types and options'
      },
      version: '1.0.0'
    });

  } catch (error) {
    console.error('Market Intelligence API GET Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}