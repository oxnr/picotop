# Picojeet

A sophisticated Bitcoin cycle prediction platform that delivers actionable trading signals through advanced on-chain analytics and real-time market intelligence.

## 🎯 Overview

Picojeet is an advanced Bitcoin cycle analysis platform that combines multiple data sources and proprietary algorithms to predict market cycles with precision. The platform features real-time market analysis, historical pattern recognition, and innovative correlation studies between crypto app rankings and market psychology.

**Current Prediction: Bitcoin Cycle Top at $132K in 6 months**

## 🚀 Key Features

### 🔮 Advanced Cycle Prediction Engine

**Mathematical Model**: Our proprietary algorithm analyzes historical data, cycle patterns, and volatility factors to predict the next Bitcoin cycle top with high confidence.

**Current Prediction**: $132K target based on:
- Current price: $105,722
- Base growth factor: 1.25 (25% conservative growth expectation)
- Cycle analysis: 6 months to peak timing
- Historical pattern matching: 2017-2018 and 2020-2021 cycle comparisons

#### Prediction Formula

```
Predicted Peak = Current Price × Growth Factor × Cycle Multiplier × Volatility Dampener

Where:
- Current Price = $105,722 (real-time)
- Growth Factor = 1.25 (base 25% growth expectation)
- Cycle Multiplier = f(months_to_peak, historical_patterns)
- Volatility Dampener = sin(cycle_position) × volatility_constant
- Peak Timing = 6 months from current (based on cycle analysis)

Result: $132K predicted cycle top
```

#### How It Works

1. **Historical Data Analysis**: Uses monthly high values from CoinMarketCap (2013-2025)
2. **Pattern Recognition**: Identifies recurring cycle patterns and timing
3. **Volatility Adjustment**: Accounts for market volatility using mathematical smoothing
4. **Real-time Updates**: Dynamically adjusts predictions as market conditions change
5. **Confidence Scoring**: Provides confidence levels based on data convergence

#### Data Inputs

- **Price History**: Monthly high values from April 2013 to current
- **Cycle Timing**: Historical cycle lengths and peak patterns
- **Market Position**: Current cycle stage assessment
- **Volatility Metrics**: Price volatility and trend analysis
- **External Factors**: Institutional adoption, regulatory environment

### 📊 Enhanced Bitcoin Chart

**Real-time Visualization** featuring:
- **Historical Price Line** (Blue): Monthly high values from 2013-2025
- **Current Price Point** (Purple): Live price with "Current" tooltip
- **Prediction Line** (Orange Dashed): 18-month future predictions
- **Perfect Label Alignment**: Month/year labels correctly positioned under data points
- **Dynamic Updates**: Automatically adjusts for current month

### 📊 Advanced Metrics Dashboard
- **Pi Cycle Top Indicator**: Mathematical convergence analysis
- **Rainbow Chart Analysis**: Logarithmic price bands with position tracking
- **NUPL Cycle Timing**: Net Unrealized Profit/Loss analysis
- **SOPR Analysis**: Spent Output Profit Ratio with forecasting
- **MVRV Z-Score**: Market Value to Realized Value deviation tracking  
- **Bitcoin Dominance**: Multi-timeframe analysis with ALT season implications
- **Fear & Greed Index**: Real-time sentiment tracking with historical context

### 📱 App Store Intelligence
- **Crypto App Rankings**: Real-time tracking of Coinbase, Phantom, Trust Wallet rankings
- **Market Psychology Correlation**: App store positioning as retail sentiment indicator
- **Retail Interest Tracking**: App download patterns correlate with market cycles
- **Historical Performance**: Track ranking changes during previous cycles

### 🎨 Premium User Experience
- **Enhanced Theme System**: Seamless dark/light mode with proper contrast optimization
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Scroll-triggered Animations**: BRRR videos spawn randomly during navigation
- **Interactive Charts**: Month/year labeling with hover tooltips and real-time updates
- **Performance Optimized**: 60fps animations with memory management

## 🛠 Tech Stack

### Core Framework
- **Next.js 15**: React framework with App Router for optimal performance
- **TypeScript 5.0+**: Full type safety across the entire application
- **Tailwind CSS 3.4+**: Utility-first styling with custom theme variables
- **Framer Motion 11+**: Smooth animations and micro-interactions

### Data & Visualization
- **Recharts 2.8+**: Advanced charting library for market data visualization
- **React Query (TanStack Query)**: Intelligent data fetching with caching and error handling
- **Multiple APIs**: CoinGecko, Coinpaprika, Fear & Greed Index integration
- **Real-time Processing**: Live market data with fallback mechanisms

### UI/UX
- **Phosphor Icons**: Consistent, beautiful iconography
- **CSS Variables**: Theme-aware color system for dark/light modes
- **Custom Components**: Reusable UI elements with animation support
- **Responsive Utilities**: Mobile-first design patterns

## 📁 Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes & endpoints
│   │   ├── bitcoin/             # Bitcoin price & metrics
│   │   │   ├── route.ts         # Current price endpoint
│   │   │   └── historical/      # Historical data endpoint
│   │   ├── rankings/            # App store rankings
│   │   └── app-store/           # iOS/Google Play data
│   ├── api-test/                # Development testing interface
│   ├── layout.tsx               # Root layout with theme provider
│   └── page.tsx                 # Main dashboard page
├── components/                   # Reusable UI components
│   ├── charts/                  # Market analysis visualizations
│   │   ├── enhanced-bitcoin-chart.tsx    # Main prediction chart
│   │   ├── visual-rainbow-chart.tsx      # Rainbow band analysis
│   │   ├── visual-nupl-chart.tsx         # NUPL cycle tracking
│   │   ├── visual-sopr-chart.tsx         # SOPR analysis
│   │   ├── visual-mvrv-chart.tsx         # MVRV Z-Score tracking
│   │   ├── comprehensive-metrics.tsx     # Advanced predictions
│   │   └── metric-gauge.tsx              # Interactive gauge displays
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── live-dashboard.tsx   # Main dashboard layout
│   │   ├── metric-card.tsx      # Prediction display cards
│   │   └── stats-card.tsx       # Metric display cards
│   ├── rankings/                # App store ranking components
│   │   └── top-apps-rankings.tsx # Crypto app tracking
│   ├── layout/                  # Navigation & structure
│   │   ├── app-layout.tsx       # Main layout wrapper
│   │   ├── sidebar.tsx          # Navigation sidebar
│   │   ├── header.tsx           # Top navigation with branding
│   │   └── footer.tsx           # Footer component
│   ├── metrics/                 # Metric-specific components
│   │   └── action-signal.tsx    # Trading signal displays
│   └── ui/                      # Base UI components
│       ├── data-status.tsx      # API health monitoring
│       ├── mini-chart.tsx       # Small chart components
│       ├── odyssey-banner.tsx   # Branding components
│       ├── picojeet-logo.tsx    # Legacy logo component
│       └── brrr-video.tsx       # Scroll animations
├── lib/                         # Core utilities & services
│   ├── api/                     # Data fetching services
│   │   ├── bitcoin.ts           # Bitcoin API client
│   │   ├── enhanced-bitcoin.ts  # Multi-source aggregation
│   │   └── real-app-store.ts    # App store APIs
│   ├── analysis/                # Prediction algorithms
│   │   └── cycle-predictor.ts   # Main prediction engine
│   ├── constants/               # Configuration & constants
│   │   └── signals.ts           # Trading signal definitions
│   ├── contexts/                # React contexts
│   │   └── theme-provider.tsx   # Theme management
│   ├── providers/               # Data providers
│   │   └── query-provider.tsx   # React Query setup
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts             # Main type definitions
│   └── utils/                   # Utility functions
│       ├── cn.ts                # Tailwind class utilities
│       ├── historical-data.ts   # Historical data processing
│       └── index.ts             # General utilities
├── hooks/                       # Custom React hooks
│   ├── use-bitcoin-data.ts      # Market data management
│   ├── use-app-rankings.ts      # App store data
│   ├── use-top-apps.ts          # Top app tracking
│   └── use-scroll-brrr.ts       # Scroll-triggered animations
└── styles/                      # Global styling
    └── globals.css              # Theme variables & base styles
```

## 🚦 Getting Started

### Prerequisites
- **Node.js 18+** (Recommended: Latest LTS)
- **Yarn 1.22+** (Package manager)

### Quick Setup

1. **Clone the repository:**
```bash
git clone https://github.com/oxnr/picotop.git
cd picotop
```

2. **Install dependencies:**
```bash
yarn install
```

3. **Start development server:**
```bash
yarn dev
```

4. **Open application:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Configuration

Create `.env.local` for API keys (optional - app works with public APIs):
```bash
# Optional: Add your API keys for enhanced data
COINGECKO_API_KEY=your_key_here
COINPAPRIKA_API_KEY=your_key_here
```

## 📊 Data Sources & APIs

### Market Data
- **BGeo Metrics API**: Primary Bitcoin price, NUPL, SOPR, MVRV, and dominance data
- **CoinGecko**: Secondary Bitcoin price and historical data
- **Coinpaprika**: Backup price feeds and market metrics  
- **Fear & Greed Index**: CNN Business sentiment tracking
- **Historical Highs**: CoinMarketCap monthly high values (2013-2025)

### App Store Rankings
- **iOS App Store**: Crypto app positioning in Finance category
- **Google Play Store**: Android app rankings and trends
- **Real-time Updates**: 30-second refresh cycles during market hours

### Prediction Engine
- **Mathematical Models**: Pi Cycle, Rainbow Chart, NUPL analysis
- **Pattern Recognition**: Historical cycle analysis and timing
- **Volatility Analysis**: Market volatility and trend calculations
- **Real-time Adjustments**: Dynamic prediction updates

## 🎯 Market Analysis Features

### Cycle Prediction Methodology

Our prediction engine combines multiple analytical approaches:

1. **Historical Pattern Analysis**: Studies 12+ years of Bitcoin price data
2. **Mathematical Modeling**: Uses exponential growth curves and volatility dampening
3. **Cycle Timing**: Analyzes historical cycle lengths and peak patterns
4. **Market Psychology**: Incorporates retail sentiment via app store rankings
5. **Risk Management**: Provides confidence intervals and uncertainty bands

### Trading Signals
- **ACCUMULATE**: Deep value zones, high confidence buy signals
- **HOLD**: Fair value ranges, maintain positions
- **DISTRIBUTE**: Late cycle warning, begin taking profits
- **SELL**: Euphoria zones, maximum profit realization

### Correlation Studies
- **App Rankings**: Crypto app store positioning vs. market psychology
- **Retail Interest**: App downloads correlation with price movements
- **Historical Patterns**: 2017 ICO boom vs. 2021 institutional cycle analysis

## 🎨 Design System

### Theme Support
- **Dark Mode**: Primary interface with purple/blue gradients
- **Light Mode**: High contrast with proper text legibility
- **CSS Variables**: Theme-aware color system with semantic tokens
- **Smooth Transitions**: Seamless theme switching with animation

### Animation Philosophy  
- **Subtle Interactions**: Enhance without overwhelming user experience
- **Performance Focused**: 60fps smooth animations with hardware acceleration
- **Contextual Feedback**: Visual responses to user actions
- **BRRR Elements**: Playful scroll-triggered videos for engagement

## 🔮 Current Market Analysis

### Real-time Status
- **Current Price**: $105,722 (live data)
- **Predicted Peak**: $132,090 (25% growth)
- **Time to Peak**: ~6 months
- **Confidence Level**: High (based on historical convergence)
- **Current Signal**: ACCUMULATE

### Cycle Position
- **Stage**: Late accumulation phase
- **Next Phase**: Acceleration toward cycle peak
- **Key Levels**: Watch for $120K breakthrough
- **Risk Factors**: Regulatory changes, macro conditions

## 🤝 Contributing

We welcome contributions to improve Picojeet! Areas of focus:

- **Algorithm Enhancement**: Improve prediction accuracy
- **New Metrics**: Additional on-chain indicators
- **Mobile Optimization**: Enhanced mobile experience  
- **API Integrations**: Additional data sources
- **UI/UX Improvements**: Animation and interaction enhancements

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 🧪 Testing

Run the test suite:
```bash
yarn test
```

Check API endpoints:
```bash
yarn test:api
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙋‍♂️ Support & Community

- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Complete guides in `/docs`
- **API Documentation**: Interactive API explorer at `/api-test`

---

**⚡ Built for precision trading - Time your positions like a pro ⚡**

*Delivering actionable Bitcoin cycle predictions through advanced analytics*