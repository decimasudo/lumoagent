# QuantAI - AI-Powered Stock Analysis Platform

## 1. Project Overview

**Project Name:** QuantAI
**Type:** Web Application (Next.js + Supabase)
**Core Functionality:** An AI-powered stock analysis platform that allows users to input a ticker symbol and receive comprehensive AI-generated analysis including quantitative insights and risk assessment.
**Target Users:** Retail investors, traders, and financial enthusiasts seeking AI-assisted stock analysis.

---

## 2. UI/UX Specification

### 2.1 Design Philosophy

The UI follows ValueCell's clean, modern aesthetic with:
- Minimalist interface with ample white space
- Clear typography hierarchy
- Subtle shadows and rounded corners
- Focus on content readability
- Professional financial color accents

### 2.2 Color Palette

| Role | Color | Hex Code |
|------|-------|----------|
| Primary | Deep Navy | #0F172A |
| Secondary | Slate Gray | #64748B |
| Accent | Electric Blue | #3B82F6 |
| Success | Emerald Green | #10B981 |
| Warning | Amber | #F59E0B |
| Danger | Rose Red | #EF4444 |
| Background | Pure White | #FFFFFF |
| Surface | Light Gray | #F8FAFC |
| Border | Gray 200 | #E2E8F0 |

### 2.3 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Heading 1 | Inter | 700 | 48px |
| Heading 2 | Inter | 600 | 36px |
| Heading 3 | Inter | 600 | 24px |
| Body | Inter | 400 | 16px |
| Small | Inter | 400 | 14px |
| Caption | Inter | 500 | 12px |

### 2.4 Spacing System

- Base unit: 4px
- Small: 8px (space-2)
- Medium: 16px (space-4)
- Large: 24px (space-6)
- XL: 32px (space-8)
- 2XL: 48px (space-12)

### 2.5 Layout Structure

#### Landing Page Sections

1. **Navigation Bar**
   - Logo (left)
   - Nav links: Features, Pricing, About (center)
   - Auth buttons: Sign In, Get Started (right)
   - Height: 72px
   - Background: White with subtle shadow

2. **Hero Section**
   - Full viewport height minus nav
   - Headline: "AI-Powered Stock Analysis"
   - Subheadline: "Get quantitative insights and risk analysis for any stock in seconds"
   - Primary CTA: "Start Analyzing Free"
   - Secondary CTA: "View Demo"
   - Background: Subtle gradient from white to light blue (#F0F9FF)

3. **Features Section**
   - 3-column grid on desktop
   - Cards with icon, title, description
   - Features:
     - Quantitative Analysis: "AI-driven quantitative strategy insights"
     - Risk Management: "Comprehensive risk assessment and metrics"
     - Real-time Data: "Latest market data and trends"

4. **How It Works Section**
   - 3-step horizontal timeline
   - Step 1: Enter Ticker
   - Step 2: AI Analysis
   - Step 3: Get Insights

5. **Footer**
   - Logo and description
   - Links: Privacy, Terms, Contact
   - Copyright

#### Dashboard Page Sections

1. **Sidebar Navigation**
   - Width: 240px
   - Logo at top
   - Menu items: Dashboard, History, Settings
   - User profile at bottom

2. **Main Content Area**
   - Search bar for ticker input
   - Analysis results cards
   - Historical analysis list

### 2.6 Components

#### Ticker Input Component
- Large input field with search icon
- Placeholder: "Enter stock ticker (e.g., AAPL)"
- Submit button with loading state
- Validation for valid ticker symbols

#### Analysis Result Card
- Header: Ticker symbol + company name
- Sections:
  - Overview (AI-generated summary)
  - Quantitative Metrics (P/E, Market Cap, etc.)
  - Risk Assessment (Volatility, Beta, etc.)
  - Strategy Suggestions
- Clean card with shadow on hover

#### History Item
- Date and time
- Ticker symbol
- Quick view of analysis summary
- Delete button

### 2.7 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640px - 1024px | 2-column grid |
| Desktop | > 1024px | Full layout with sidebar |

### 2.8 Animations & Transitions

- Button hover: scale(1.02), 150ms ease
- Card hover: translateY(-2px), shadow increase, 200ms ease
- Page transitions: fade-in, 300ms
- Loading states: pulse animation
- Input focus: border color transition, 150ms

---

## 3. Functionality Specification

### 3.1 Core Features

#### F1: Landing Page
- Display product information and value proposition
- Navigate to dashboard on CTA click
- Responsive design for all devices

#### F2: User Authentication (Supabase Auth)
- Email/password sign up and sign in
- Social auth: Google (optional)
- Session management
- Protected dashboard route

#### F3: Ticker Analysis
- Input field accepts stock ticker symbols
- Validates ticker format (1-5 uppercase letters)
- Fetches stock data from Yahoo Finance API
- Sends data to OpenRouter AI for analysis
- Displays AI-generated insights

#### F4: AI Analysis (OpenRouter)
- Model: OpenRouter supported models
- Analysis includes:
  - Company overview
  - Quantitative metrics interpretation
  - Risk assessment
  - Strategy suggestions
- Streaming response for better UX

#### F5: Analysis History (Supabase DB)
- Store all analyses in Supabase database
- Display history on dashboard
- Delete individual analyses
- Associate with user account

#### F6: Dashboard
- Search and analyze new tickers
- View past analyses
- Quick re-analysis option

### 3.2 User Interactions & Flows

#### Flow 1: New User Sign Up
1. User clicks "Get Started"
2. Redirect to sign up page
3. Enter email and password
4. Confirm email (if enabled)
5. Redirect to dashboard

#### Flow 2: Analyze Stock
1. User enters ticker in search field
2. Click "Analyze" or press Enter
3. Show loading state
4. Fetch stock data from API
5. Send to OpenRouter AI
6. Display results in cards
7. Save to analysis history

#### Flow 3: View History
1. User clicks "History" in sidebar
2. Display list of past analyses
3. Click item to view details
4. Option to delete or re-analyze

### 3.3 Data Handling

#### Stock Data API
- Provider: Yahoo Finance (via RapidAPI or similar free API)
- Data points:
  - Current price
  - Market cap
  - P/E ratio
  - 52-week high/low
  - Volume
  - Earnings per share
  - Dividend yield

#### AI Analysis Prompt
```
Analyze the following stock data for {TICKER}:
- Current Price: ${price}
- Market Cap: ${marketCap}
- P/E Ratio: ${peRatio}
- 52-Week Range: ${week52Low} - ${week52High}
- Volume: ${volume}
- EPS: ${eps}
- Dividend Yield: ${dividendYield}

Provide:
1. Brief company overview (2-3 sentences)
2. Quantitative analysis (interpret the metrics)
3. Risk assessment (volatility, potential concerns)
4. Investment strategy suggestion (bullish/neutral/bearish with reasoning)
```

### 3.4 Edge Cases

| Scenario | Handling |
|----------|----------|
| Invalid ticker | Show error message: "Invalid ticker symbol" |
| API rate limit | Show message and suggest retry later |
| Network error | Show retry button with error message |
| Empty input | Disable submit button, show placeholder |
| AI timeout | Show partial results with retry option |
| No auth (viewing demo) | Allow limited analyses, prompt sign up |

---

## 4. Technical Architecture

### 4.1 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React, TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Charts | Recharts |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | OpenRouter API |
| Stock Data | Yahoo Finance API |

### 4.2 Project Structure

```
/app
  /layout.tsx          # Root layout with providers
  /page.tsx            # Landing page
  /dashboard
    /page.tsx          # Dashboard (protected)
  /auth
    /signin/page.tsx   # Sign in page
    /signup/page.tsx   # Sign up page
  /api
    /analyze/route.ts  # Stock analysis endpoint
    /history/route.ts  # Analysis history endpoint
/components
  /ui                  # Reusable UI components
  /landing             # Landing page components
  /dashboard           # Dashboard components
/lib
  /supabase.ts         # Supabase client
  /openrouter.ts       # OpenRouter client
  /stocks.ts           # Stock data fetching
/types
  /index.ts            # TypeScript types
```

### 4.3 Supabase Schema

```sql
-- analyses table
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  ticker VARCHAR(10) NOT NULL,
  company_name VARCHAR(255),
  stock_data JSONB,
  ai_analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analyses
CREATE POLICY "Users can view own analyses"
ON analyses FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
ON analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own analyses
CREATE POLICY "Users can delete own analyses"
ON analyses FOR DELETE
USING (auth.uid() = user_id);
```

### 4.4 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key

# Stock API (if using premium)
STOCK_API_KEY=your_stock_api_key
```

---

## 5. Acceptance Criteria

### AC1: Landing Page
- [ ] Navigation bar displays correctly with logo and links
- [ ] Hero section shows headline, subheadline, and CTAs
- [ ] Features section displays 3 feature cards
- [ ] How it works section shows 3 steps
- [ ] Footer displays correctly
- [ ] Page is responsive on mobile, tablet, desktop

### AC2: Authentication
- [ ] User can sign up with email/password
- [ ] User can sign in with email/password
- [ ] User session persists across page refreshes
- [ ] Protected routes redirect to sign in
- [ ] User can sign out

### AC3: Stock Analysis
- [ ] Ticker input accepts valid stock symbols
- [ ] Invalid input shows validation error
- [ ] Loading state displays during analysis
- [ ] AI analysis results display correctly
- [ ] Results include overview, metrics, risk, strategy

### AC4: History
- [ ] Analyses save to Supabase database
- [ ] History displays on dashboard
- [ ] User can delete analyses
- [ ] History persists across sessions

### AC5: UI/UX
- [ ] Color scheme matches specification
- [ ] Typography is consistent
- [ ] Animations are smooth
- [ ] Loading states are visible
- [ ] Error messages are clear

### AC6: Performance
- [ ] Page loads in under 3 seconds
- [ ] API responses handled within 10 seconds
- [ ] No console errors in production
- [ ] Lighthouse score > 80

---

## 6. Future Enhancements (Post-MVP)

- Real-time stock price charts
- Multiple AI models selection
- Portfolio tracking
- Technical indicators
- Email alerts
- Mobile app
- Social features
- Paper trading simulation
