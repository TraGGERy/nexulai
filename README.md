# McKinsey AI Consulting Dashboard

A comprehensive AI-powered strategic consulting platform that generates McKinsey-quality reports using OpenAI integration.

## Features

- **9-Phase Strategic Analysis**: Complete strategic assessment framework
- **AI-Powered Report Generation**: Uses OpenAI GPT-4 to generate comprehensive McKinsey-style reports
- **Real-time Analysis**: Dynamic form processing with intelligent data collection
- **Professional Output**: Executive-ready strategic reports with actionable recommendations
- **Implementation Roadmaps**: Detailed 90-day, 6-month, and 12-month execution plans

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API
1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Copy the `.env.local` file and add your API key:
```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 3. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## How It Works

### Strategic Analysis Process
1. **Phase 1-2**: Business Context & Stakeholder Definition
2. **Phase 3-4**: Market Research & Framework Selection  
3. **Phase 5-6**: Data Configuration & Strategic Options
4. **Phase 7-8**: Implementation Planning & Report Configuration
5. **Phase 9**: Strategic Implementation Roadmap

### AI Integration
- The system collects comprehensive data across all 9 phases
- When "Generate Analysis" is clicked, all form data is sent to OpenAI
- GPT-4 processes the information using McKinsey methodologies
- A structured, professional report is generated with:
  - Executive Summary
  - Situation Analysis
  - Strategic Recommendations
  - Implementation Roadmap
  - Risk Assessment
  - Success Metrics

### Report Quality
The AI generates reports that include:
- **Strategic Recommendations**: 4-6 prioritized recommendations with impact assessment
- **Implementation Timeline**: Detailed 90-day, 6-month, and 12-month plans
- **Risk Mitigation**: Comprehensive risk assessment with monitoring frameworks
- **Success Metrics**: Quantifiable KPIs and measurement approaches
- **Governance Structure**: Implementation oversight and decision-making frameworks

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI Integration**: OpenAI GPT-4o
- **Deployment**: Vercel-ready

## API Endpoints

- `POST /api/generate-report`: Generates comprehensive strategic reports using OpenAI

## Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

1. Navigate through the 9-phase strategic analysis form
2. Fill in relevant business information for each phase
3. Click "Generate Analysis" to create your McKinsey-quality report
4. Review the comprehensive strategic recommendations and implementation roadmap

## Features in Detail

### Phase 1: Business Context
- Core business challenge identification
- Industry/market specification
- Strategic questions definition

### Phase 2: Stakeholder & Success Definition
- Key stakeholder mapping
- Success metrics definition
- Decision timeline establishment

### Phase 3: Market Research Scope
- Competitive landscape analysis
- Customer segment identification
- Geographic market scope

### Phase 4: Framework Selection
- Strategic framework selection (Porter's Five Forces, McKinsey 7S, etc.)
- Analysis depth configuration

### Phase 5: Data & Insights Configuration
- Available data sources
- Data constraints identification

### Phase 6: Strategic Options Development
- Risk tolerance assessment
- Resource constraints evaluation

### Phase 7: Implementation Planning
- Implementation timeline definition
- Organizational readiness assessment

### Phase 8: Executive Report Configuration
- Report audience specification
- Presentation format selection

### Phase 9: Strategic Implementation Roadmap
- 90-day quick wins
- 6-month strategic initiatives
- 12-month transformation milestones
- Risk monitoring approach
- Governance structure

## Contributing

This is a professional consulting tool designed to generate high-quality strategic reports. Contributions should maintain the professional standard and McKinsey methodology alignment.

## License

Private - Professional Consulting Tool
