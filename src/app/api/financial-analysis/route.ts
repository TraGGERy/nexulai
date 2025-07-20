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
      analysisType,
      financialPeriod,
      currency,
      revenueData,
      expenseData,
      balanceSheetData,
      cashFlowData,
      industryBenchmarks,
      specificMetrics,
      analysisGoals
    } = requestData;

    // Validate required fields
    if (!company || !analysisType || !financialPeriod) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: company, analysisType, and financialPeriod are required'
      }, { status: 400 });
    }

    // Create comprehensive financial analysis prompt
    const prompt = `
IMPORTANT: Your final response MUST be formatted as a valid, parseable JSON object following the schema provided at the end of this prompt. Do not include any text outside the JSON structure.

You are a senior financial analyst with expertise in financial modeling, ratio analysis, and strategic financial planning. Generate a detailed financial analysis report based on the following parameters:

ANALYSIS PARAMETERS:
- Company: ${company}
- Analysis Type: ${analysisType}
- Financial Period: ${financialPeriod}
- Currency: ${currency || 'USD'}
- Revenue Data: ${revenueData || 'Not provided - use industry estimates'}
- Expense Data: ${expenseData || 'Not provided - use industry estimates'}
- Balance Sheet Data: ${balanceSheetData || 'Not provided - use industry estimates'}
- Cash Flow Data: ${cashFlowData || 'Not provided - use industry estimates'}
- Industry Benchmarks: ${industryBenchmarks || 'Use standard industry benchmarks'}
- Specific Metrics: ${specificMetrics || 'Standard financial ratios'}
- Analysis Goals: ${analysisGoals || 'Comprehensive financial health assessment'}

ANALYSIS TYPES AVAILABLE:
1. Financial Health Assessment
2. Profitability Analysis
3. Liquidity & Cash Flow Analysis
4. Investment Valuation
5. Risk Assessment & Credit Analysis
6. Budget vs Actual Analysis
7. Financial Forecasting & Projections
8. Cost Structure Analysis
9. Working Capital Management
10. Capital Structure Optimization

Generate a comprehensive financial analysis report that includes:

1. EXECUTIVE SUMMARY
   - Overall financial health assessment
   - Key financial strengths and weaknesses
   - Critical financial metrics summary
   - Strategic financial recommendations

2. FINANCIAL PERFORMANCE ANALYSIS
   - Revenue analysis and trends
   - Profitability assessment
   - Expense structure analysis
   - Year-over-year comparisons

3. FINANCIAL RATIOS ANALYSIS
   - Liquidity ratios
   - Profitability ratios
   - Efficiency ratios
   - Leverage ratios
   - Market valuation ratios

4. CASH FLOW ANALYSIS
   - Operating cash flow assessment
   - Investment cash flow analysis
   - Financing cash flow evaluation
   - Free cash flow calculation

5. BALANCE SHEET ANALYSIS
   - Asset composition and quality
   - Liability structure assessment
   - Equity analysis
   - Working capital evaluation

6. INDUSTRY BENCHMARKING
   - Peer comparison analysis
   - Industry average comparisons
   - Competitive positioning
   - Market performance relative analysis

7. RISK ASSESSMENT
   - Financial risk factors
   - Credit risk evaluation
   - Market risk assessment
   - Operational risk indicators

8. FINANCIAL PROJECTIONS
   - Revenue forecasts
   - Expense projections
   - Cash flow predictions
   - Scenario analysis

Ensure the analysis is:
- Data-driven with specific financial metrics and ratios
- Actionable with clear financial recommendations
- Comprehensive covering all financial aspects
- Professional and suitable for executive and investor presentation
- Include specific numbers, percentages, and financial projections where applicable

REQUIRED JSON RESPONSE SCHEMA:
{
  "executiveSummary": {
    "overallHealth": "excellent/good/fair/poor",
    "healthScore": "score out of 100",
    "keyStrengths": ["strength1", "strength2", "strength3"],
    "keyWeaknesses": ["weakness1", "weakness2", "weakness3"],
    "criticalMetrics": {
      "revenue": "amount and trend",
      "profitability": "margin and trend",
      "liquidity": "ratio and assessment",
      "leverage": "ratio and assessment"
    },
    "strategicRecommendations": ["recommendation1", "recommendation2", "recommendation3"]
  },
  "financialPerformance": {
    "revenueAnalysis": {
      "currentRevenue": "amount",
      "revenueGrowth": "percentage",
      "revenueStreams": [
        {
          "stream": "revenue stream name",
          "amount": "amount",
          "percentage": "percentage of total",
          "trend": "growing/stable/declining"
        }
      ],
      "seasonality": "seasonal patterns if any"
    },
    "profitabilityAnalysis": {
      "grossMargin": "percentage",
      "operatingMargin": "percentage",
      "netMargin": "percentage",
      "ebitda": "amount",
      "ebitdaMargin": "percentage",
      "trends": "profitability trends analysis"
    },
    "expenseAnalysis": {
      "totalExpenses": "amount",
      "expenseGrowth": "percentage",
      "majorExpenseCategories": [
        {
          "category": "expense category",
          "amount": "amount",
          "percentage": "percentage of total",
          "trend": "increasing/stable/decreasing"
        }
      ],
      "costStructure": "fixed vs variable cost analysis"
    }
  },
  "financialRatios": {
    "liquidityRatios": {
      "currentRatio": "ratio value",
      "quickRatio": "ratio value",
      "cashRatio": "ratio value",
      "workingCapital": "amount",
      "assessment": "liquidity assessment"
    },
    "profitabilityRatios": {
      "grossProfitMargin": "percentage",
      "operatingProfitMargin": "percentage",
      "netProfitMargin": "percentage",
      "returnOnAssets": "percentage",
      "returnOnEquity": "percentage",
      "assessment": "profitability assessment"
    },
    "efficiencyRatios": {
      "assetTurnover": "ratio value",
      "inventoryTurnover": "ratio value",
      "receivablesTurnover": "ratio value",
      "payablesTurnover": "ratio value",
      "assessment": "efficiency assessment"
    },
    "leverageRatios": {
      "debtToEquity": "ratio value",
      "debtToAssets": "ratio value",
      "interestCoverage": "ratio value",
      "debtServiceCoverage": "ratio value",
      "assessment": "leverage assessment"
    }
  },
  "cashFlowAnalysis": {
    "operatingCashFlow": {
      "amount": "cash flow amount",
      "trend": "trend analysis",
      "quality": "high/medium/low",
      "sustainability": "assessment"
    },
    "investingCashFlow": {
      "amount": "cash flow amount",
      "majorInvestments": ["investment1", "investment2"],
      "capexTrend": "capital expenditure trend"
    },
    "financingCashFlow": {
      "amount": "cash flow amount",
      "debtChanges": "debt increase/decrease",
      "equityChanges": "equity changes",
      "dividendPolicy": "dividend analysis"
    },
    "freeCashFlow": {
      "amount": "free cash flow amount",
      "trend": "trend analysis",
      "yield": "free cash flow yield"
    }
  },
  "balanceSheetAnalysis": {
    "assetAnalysis": {
      "totalAssets": "amount",
      "assetComposition": [
        {
          "category": "asset category",
          "amount": "amount",
          "percentage": "percentage of total"
        }
      ],
      "assetQuality": "high/medium/low",
      "assetGrowth": "growth rate"
    },
    "liabilityAnalysis": {
      "totalLiabilities": "amount",
      "liabilityStructure": [
        {
          "category": "liability category",
          "amount": "amount",
          "percentage": "percentage of total"
        }
      ],
      "debtMaturity": "debt maturity profile",
      "liabilityGrowth": "growth rate"
    },
    "equityAnalysis": {
      "totalEquity": "amount",
      "equityGrowth": "growth rate",
      "retainedEarnings": "amount",
      "equityRatio": "percentage"
    },
    "workingCapital": {
      "amount": "working capital amount",
      "trend": "trend analysis",
      "efficiency": "working capital efficiency",
      "management": "working capital management assessment"
    }
  },
  "industryBenchmarking": {
    "peerComparison": [
      {
        "metric": "financial metric",
        "companyValue": "company's value",
        "industryAverage": "industry average",
        "percentile": "company's percentile ranking",
        "assessment": "above/below/at industry average"
      }
    ],
    "competitivePosition": "strong/average/weak",
    "marketShare": "market share if available",
    "industryTrends": ["trend1", "trend2", "trend3"]
  },
  "riskAssessment": {
    "financialRisks": [
      {
        "risk": "risk description",
        "severity": "high/medium/low",
        "probability": "high/medium/low",
        "impact": "potential impact",
        "mitigation": "mitigation strategies"
      }
    ],
    "creditRisk": {
      "creditRating": "estimated credit rating",
      "defaultProbability": "low/medium/high",
      "creditFactors": ["factor1", "factor2"]
    },
    "marketRisk": {
      "volatility": "high/medium/low",
      "marketExposure": "exposure level",
      "hedgingStrategies": ["strategy1", "strategy2"]
    }
  },
  "financialProjections": {
    "revenueForecasts": [
      {
        "period": "time period",
        "projectedRevenue": "amount",
        "growthRate": "percentage",
        "assumptions": ["assumption1", "assumption2"]
      }
    ],
    "expenseProjections": [
      {
        "period": "time period",
        "projectedExpenses": "amount",
        "majorDrivers": ["driver1", "driver2"]
      }
    ],
    "cashFlowProjections": [
      {
        "period": "time period",
        "operatingCashFlow": "amount",
        "freeCashFlow": "amount",
        "assumptions": ["assumption1", "assumption2"]
      }
    ],
    "scenarioAnalysis": {
      "baseCase": "base case assumptions and outcomes",
      "optimisticCase": "optimistic scenario",
      "pessimisticCase": "pessimistic scenario"
    }
  },
  "recommendations": {
    "immediate": [
      {
        "recommendation": "immediate action",
        "rationale": "why this is needed",
        "expectedImpact": "expected financial impact",
        "timeline": "implementation timeline"
      }
    ],
    "shortTerm": [
      {
        "recommendation": "short-term action",
        "rationale": "why this is needed",
        "expectedImpact": "expected financial impact",
        "timeline": "implementation timeline"
      }
    ],
    "longTerm": [
      {
        "recommendation": "long-term strategy",
        "rationale": "strategic rationale",
        "expectedImpact": "expected financial impact",
        "timeline": "implementation timeline"
      }
    ]
  },
  "metadata": {
    "analysisDate": "current date",
    "analyst": "AI Financial Analyst",
    "reportType": "Financial Analysis",
    "currency": "currency used",
    "version": "1.0"
  }
}`;

    // Generate financial analysis using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior financial analyst with expertise in financial modeling, ratio analysis, valuation, and strategic financial planning. You provide comprehensive financial insights and actionable recommendations based on thorough financial analysis."
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
        message: 'Failed to generate financial analysis'
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
    const reportTitle = `Financial Analysis - ${company} (${analysisType})`;
    const newReport = await db.insert(reports).values({
      title: reportTitle,
      type: 'financial',
      content: {
        analysis: analysisData,
        requestParameters: {
          company,
          analysisType,
          financialPeriod,
          currency,
          revenueData,
          expenseData,
          balanceSheetData,
          cashFlowData,
          industryBenchmarks,
          specificMetrics,
          analysisGoals
        },
        generatedAt: new Date().toISOString(),
        analysisId: `FIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
      message: 'Financial analysis generated and saved successfully',
      data: {
        reportId: newReport[0].id,
        analysis: analysisData,
        requestParameters: {
          company,
          analysisType,
          financialPeriod,
          currency,
          revenueData,
          expenseData,
          balanceSheetData,
          cashFlowData,
          industryBenchmarks,
          specificMetrics,
          analysisGoals
        },
        generatedAt: new Date().toISOString(),
        analysisId: `FIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });

  } catch (error) {
    console.error('Financial Analysis API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error occurred while generating financial analysis'
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
              id: 'financial-health',
              name: 'Financial Health Assessment',
              description: 'Comprehensive evaluation of overall financial health and stability',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Financial ratios', 'Liquidity analysis', 'Profitability metrics', 'Risk assessment']
            },
            {
              id: 'profitability-analysis',
              name: 'Profitability Analysis',
              description: 'Detailed analysis of profit margins, revenue streams, and cost structure',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Profit margins', 'Revenue analysis', 'Cost structure', 'Profitability trends']
            },
            {
              id: 'liquidity-cashflow',
              name: 'Liquidity & Cash Flow Analysis',
              description: 'Cash flow assessment and liquidity position evaluation',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Cash flow analysis', 'Liquidity ratios', 'Working capital', 'Cash management']
            },
            {
              id: 'investment-valuation',
              name: 'Investment Valuation',
              description: 'Company valuation and investment attractiveness assessment',
              estimatedTime: '25-30 minutes',
              dataPoints: ['Valuation multiples', 'DCF analysis', 'Investment metrics', 'Risk-return profile']
            },
            {
              id: 'risk-credit-analysis',
              name: 'Risk Assessment & Credit Analysis',
              description: 'Financial risk evaluation and creditworthiness assessment',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Credit risk', 'Financial stability', 'Risk factors', 'Default probability']
            },
            {
              id: 'budget-actual',
              name: 'Budget vs Actual Analysis',
              description: 'Performance against budget and variance analysis',
              estimatedTime: '15-20 minutes',
              dataPoints: ['Budget variances', 'Performance metrics', 'Forecast accuracy', 'Trend analysis']
            },
            {
              id: 'financial-forecasting',
              name: 'Financial Forecasting & Projections',
              description: 'Future financial performance projections and scenario analysis',
              estimatedTime: '25-30 minutes',
              dataPoints: ['Revenue forecasts', 'Expense projections', 'Cash flow predictions', 'Scenario modeling']
            },
            {
              id: 'cost-structure',
              name: 'Cost Structure Analysis',
              description: 'Detailed cost analysis and cost optimization opportunities',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Cost breakdown', 'Cost drivers', 'Fixed vs variable costs', 'Cost optimization']
            },
            {
              id: 'working-capital',
              name: 'Working Capital Management',
              description: 'Working capital efficiency and optimization analysis',
              estimatedTime: '20-25 minutes',
              dataPoints: ['Working capital ratios', 'Cash conversion cycle', 'Inventory management', 'Receivables analysis']
            },
            {
              id: 'capital-structure',
              name: 'Capital Structure Optimization',
              description: 'Debt-equity mix analysis and capital structure recommendations',
              estimatedTime: '25-30 minutes',
              dataPoints: ['Debt ratios', 'Cost of capital', 'Leverage analysis', 'Optimal capital structure']
            }
          ],
          financialPeriods: [
            'Monthly',
            'Quarterly',
            'Semi-Annual',
            'Annual',
            'Multi-Year (2-3 years)',
            'Multi-Year (3-5 years)',
            'Custom Period'
          ],
          currencies: [
            'USD - US Dollar',
            'EUR - Euro',
            'GBP - British Pound',
            'JPY - Japanese Yen',
            'CAD - Canadian Dollar',
            'AUD - Australian Dollar',
            'CHF - Swiss Franc',
            'CNY - Chinese Yuan',
            'INR - Indian Rupee',
            'Other'
          ],
          financialMetrics: [
            'Revenue & Growth',
            'Profit Margins',
            'Return on Investment',
            'Liquidity Ratios',
            'Leverage Ratios',
            'Efficiency Ratios',
            'Market Valuation',
            'Cash Flow Metrics',
            'Working Capital',
            'Cost Ratios',
            'Risk Metrics',
            'Custom Metrics'
          ],
          industryBenchmarks: [
            'Technology',
            'Healthcare',
            'Financial Services',
            'Retail',
            'Manufacturing',
            'Energy',
            'Real Estate',
            'Telecommunications',
            'Consumer Goods',
            'Industrial',
            'Utilities',
            'Materials',
            'Other'
          ]
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Financial Analysis AI API is operational',
      endpoints: {
        'POST /api/financial-analysis': 'Generate financial analysis',
        'GET /api/financial-analysis?info=capabilities': 'Get available analysis types and options'
      },
      version: '1.0.0'
    });

  } catch (error) {
    console.error('Financial Analysis API GET Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}