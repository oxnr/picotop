# Picotop

A sophisticated Bitcoin cycle prediction platform that helps degens time their perfect jeets through advanced on-chain analysis and app store ranking correlation studies.

## 🎯 Overview

Picotop is an advanced Bitcoin cycle analysis platform that combines multiple data sources and proprietary metrics to identify optimal exit points during bull market cycles. Built as part of the **Odyssey ecosystem**, it features real-time market analysis, historical cycle patterns, and innovative correlation studies between crypto app rankings and market psychology.

## 🚀 Key Features

### 🔮 Cycle Prediction Engine
- **Pi Cycle Top Prediction**: Mathematical model predicting September 2025 cycle peak at $185K
- **Rainbow Chart Analysis**: Logarithmic price bands with current position tracking ($108K in Indigo band)
- **NUPL Cycle Timing**: Net Unrealized Profit/Loss analysis with ALT season correlation
- **Historical Pattern Matching**: 2017-2018 and 2020-2021 cycle comparisons with 2025 predictions

### 📊 Advanced Metrics Dashboard
- **SOPR Analysis**: Spent Output Profit Ratio with 1.5-year forecasting
- **MVRV Z-Score**: Market Value to Realized Value deviation tracking  
- **Bitcoin Dominance**: Multi-timeframe analysis with ALT season implications
- **Fear & Greed Index**: Real-time sentiment tracking with historical context

### 📱 App Store Intelligence
- **Crypto App Rankings**: Real-time tracking of Coinbase, Phantom, Trust Wallet rankings
- **Market Psychology Correlation**: App store positioning as retail sentiment indicator
- **Single-row Layout**: Enhanced visual design for quick ranking assessment
- **Historical Performance**: Track ranking changes during previous cycles

### 🎨 Premium User Experience
- **Theme System**: Seamless dark/light mode with proper contrast optimization
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Scroll-triggered Animations**: BRRR videos spawn randomly during navigation
- **Interactive Charts**: Month/year labeling with hover tooltips
- **Real-time Updates**: Live data feeds with API health monitoring

## 🌟 Odyssey Project

Picotop is proudly part of the **Odyssey ecosystem** - advancing the future of decentralized applications and empowering the next generation of crypto tools.

- **Built by**: [Binary Builders](https://binary.builders)
- **Ecosystem**: [Odyssey](https://binary.builders/odyssey/)
- **Vision**: Democratizing advanced market analysis for the crypto community

## 🛠 Tech Stack

### Core Framework
- **Next.js 15**: React framework with App Router for optimal performance
- **TypeScript**: Full type safety across the entire application
- **Tailwind CSS**: Utility-first styling with custom theme variables
- **Framer Motion**: Smooth animations and micro-interactions

### Data & Visualization
- **Recharts**: Advanced charting library for market data visualization
- **React Query**: Intelligent data fetching with caching and error handling
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
│   │   ├── rankings/            # App store rankings
│   │   └── app-store/           # iOS/Google Play data
│   ├── api-test/                # Development testing interface
│   └── layout.tsx               # Root layout with theme provider
├── components/                   # Reusable UI components
│   ├── charts/                  # Market analysis visualizations
│   │   ├── enhanced-bitcoin-chart.tsx    # Historical + prediction chart
│   │   ├── visual-rainbow-chart.tsx      # Rainbow band analysis
│   │   ├── visual-nupl-chart.tsx         # NUPL cycle tracking
│   │   ├── visual-sopr-chart.tsx         # SOPR analysis
│   │   ├── visual-mvrv-chart.tsx         # MVRV Z-Score tracking
│   │   ├── comprehensive-metrics.tsx     # Advanced predictions
│   │   └── metric-gauge.tsx              # Interactive gauge displays
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── live-dashboard.tsx   # Main dashboard layout
│   │   └── stats-card.tsx       # Metric display cards
│   ├── rankings/                # App store ranking components
│   │   └── top-apps-rankings.tsx # Crypto app tracking
│   ├── layout/                  # Navigation & structure
│   │   ├── sidebar.tsx          # Navigation sidebar
│   │   ├── header.tsx           # Top navigation
│   │   └── footer.tsx           # Odyssey attribution
│   └── ui/                      # Base UI components
│       ├── data-status.tsx      # API health monitoring
│       ├── picojeet-logo.tsx    # Brand components
│       └── brrr-video.tsx       # Scroll animations
├── lib/                         # Core utilities & services
│   ├── api/                     # Data fetching services
│   │   ├── bitcoin.ts           # Bitcoin API client
│   │   ├── enhanced-bitcoin.ts  # Multi-source aggregation
│   │   └── real-app-store.ts    # App store APIs
│   ├── analysis/                # Prediction algorithms
│   │   └── cycle-predictor.ts   # Pi Cycle & Rainbow analysis
│   ├── constants/               # Configuration & constants
│   │   └── signals.ts           # Trading signal definitions
│   └── types/                   # TypeScript definitions
├── hooks/                       # Custom React hooks
│   ├── use-bitcoin-data.ts      # Market data management
│   ├── use-app-rankings.ts      # App store data
│   └── use-scroll-brrr.ts       # Scroll-triggered animations
└── styles/                      # Global styling
    └── globals.css              # Theme variables & base styles
```

## 🚦 Getting Started

### Prerequisites
- **Node.js 18+** (Recommended: Latest LTS)
- **npm/yarn/pnpm** (Package manager)

### Quick Setup

1. **Clone the repository:**
```bash
git clone https://github.com/oxnr/picotop.git
cd picotop
```

2. **Install dependencies:**
```bash
npm install
# or yarn install / pnpm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open application:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Configuration

Create `.env.local` for API keys (optional - app works with mock data):
```bash
# Optional: Add your API keys for enhanced data
COINGECKO_API_KEY=your_key_here
COINPAPRIKA_API_KEY=your_key_here
```

## 📊 Data Sources & APIs

### Market Data
- **CoinGecko**: Primary Bitcoin price, dominance, and historical data
- **Coinpaprika**: Backup price feeds and market metrics  
- **Fear & Greed Index**: CNN Business sentiment tracking
- **Custom Calculations**: NUPL, SOPR, MVRV derived from on-chain data

### App Store Rankings
- **iOS App Store**: Crypto app positioning in Finance category
- **Google Play Store**: Android app rankings and trends
- **Real-time Updates**: 30-second refresh cycles during market hours

### Historical Data
- **5+ Years**: Complete Bitcoin price history from 2020 COVID crash
- **Monthly Granularity**: Accurate historical monthly closes
- **Cycle Annotations**: Major events (COVID crash, China ban, ETF approval, etc.)

## 🎯 Market Analysis Features

### Cycle Top Predictions
- **Pi Cycle Convergence**: September 17, 2025 target date
- **Rainbow Band**: Currently in Indigo ($105K-$150K range)
- **NUPL Levels**: 0.78 indicates late-stage bull market
- **ALT Season Timing**: Estimated peak October 2025

### Trading Signals
- **ACCUMULATE**: Deep value zones (Red/Orange rainbow bands)
- **HOLD**: Fair value ranges (Yellow/Green bands)  
- **DISTRIBUTE**: Late cycle warning (Blue/Indigo bands)
- **SELL**: Euphoria zones (Violet band, $150K+)

### Correlation Studies
- **App Rankings**: Crypto app store positioning vs. market psychology
- **Retail Interest**: App downloads correlation with price movements
- **Historical Patterns**: 2017 ICO boom vs. 2021 meme coin cycle analysis

## 🎨 Design System

### Theme Support
- **Dark Mode**: Primary interface with purple/orange accents
- **Light Mode**: High contrast with proper text legibility
- **CSS Variables**: Theme-aware color system
- **Smooth Transitions**: Seamless theme switching

### Animation Philosophy  
- **Subtle Interactions**: Enhance without overwhelming
- **Performance Focused**: 60fps smooth animations
- **Contextual Feedback**: Visual responses to user actions
- **BRRR Elements**: Playful scroll-triggered videos for engagement

## 🔮 2025 Predictions

### Cycle Timeline
- **Q1 2025**: Current phase - late stage accumulation
- **Q2 2025**: Acceleration phase, approach Pi Cycle convergence
- **Q3 2025**: Cycle top around September (Pi Cycle prediction)
- **Q4 2025**: ALT season peak, then gradual decline

### Price Targets
- **Conservative**: $150K-$185K (Pi Cycle model)
- **Optimistic**: $200K+ (Rainbow Violet band)
- **PlanB S2F**: $1M (Stock-to-Flow model)

## 🤝 Contributing

We welcome contributions to improve Picotop! Areas of focus:

- **New Metrics**: Additional on-chain indicators
- **Mobile Optimization**: Enhanced mobile experience  
- **API Integrations**: Additional data sources
- **UI/UX Improvements**: Animation and interaction enhancements

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙋‍♂️ Support & Community

- **GitHub Issues**: Bug reports and feature requests
- **Odyssey Discord**: Community discussions and support
- **Binary Builders**: Professional development services

---

**⚡ Built for degens, by degens - Time your jeet like a pro ⚡**

*Part of the Odyssey ecosystem - advancing decentralized applications*