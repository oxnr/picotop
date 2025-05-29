# CycleTop

A modern, sophisticated web application for predicting Bitcoin cycle tops through comprehensive market analysis and proprietary algorithms.

## 🎯 Overview

CycleTop is an advanced Bitcoin cycle prediction platform that combines multiple data sources and metrics to provide insights into potential Bitcoin cycle peaks. Built with cutting-edge web technologies, it features a sleek, modern interface with delightful animations and comprehensive market analysis tools.

## 🚀 Features

### Core Functionality
- **App Store Rankings Analysis**: Track crypto app rankings (Coinbase, Phantom, etc.) as market sentiment indicators
- **Bitcoin Metrics Dashboard**: Comprehensive analysis of key Bitcoin metrics including:
  - NUPL (Net Unrealized Profit/Loss)
  - SOPR (Spent Output Profit Ratio)
  - MVZR (Market Value to Realized Value Z-Score)
  - Rainbow Chart analysis
- **Proprietary Cycle Prediction**: Advanced algorithms for cycle top prediction
- **Real-time Data Integration**: Live market data and analytics

### Design & User Experience
- **Modern UI/UX**: Sleek, polished interface with subtle yet powerful animations
- **Phosphor Icons**: Beautiful, consistent iconography throughout the app
- **Responsive Design**: Optimized for desktop and mobile experiences
- **Dark/Light Mode**: Adaptive theming for user preference
- **Interactive Visualizations**: Rich charts and graphs for data analysis

## 🛠 Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Phosphor Icons**: Modern icon library
- **Framer Motion**: Smooth animations and transitions
- **Chart.js/Recharts**: Data visualization
- **React Query**: Data fetching and state management

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **Turbopack**: Fast development bundling

## 📋 Architecture

```
src/
├── app/                 # Next.js App Router
│   ├── dashboard/       # Main dashboard pages
│   ├── metrics/         # Individual metric pages
│   └── api/            # API routes
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── charts/         # Chart components
│   └── dashboard/      # Dashboard-specific components
├── lib/                # Utility functions and configurations
│   ├── api/            # API clients and data fetching
│   ├── utils/          # Helper functions
│   └── types/          # TypeScript type definitions
├── hooks/              # Custom React hooks
└── styles/             # Global styles and theme configuration
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CycleTop
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Data Sources

### App Store Rankings
- iOS App Store API
- Google Play Store API
- Third-party app analytics services

### Bitcoin Metrics
- On-chain data providers (Glassnode, IntoTheBlock)
- Exchange APIs for price data
- Custom calculation engines for proprietary metrics

## 🎨 Design Philosophy

CycleTop is designed to be:
- **Intuitive**: Easy to understand complex market data
- **Elegant**: Beautiful, modern interface that's pleasing to use
- **Performant**: Fast loading and smooth interactions
- **Accessible**: Inclusive design for all users
- **Delightful**: Subtle animations that enhance the experience

## 🔮 Roadmap

### Phase 1: Foundation
- [x] Project setup and architecture
- [ ] Core dashboard implementation
- [ ] Basic metric integrations
- [ ] UI component library

### Phase 2: Data Integration
- [ ] App store rankings API integration
- [ ] Bitcoin metrics data pipeline
- [ ] Real-time data streaming
- [ ] Historical data analysis

### Phase 3: Advanced Features
- [ ] Proprietary prediction algorithms
- [ ] Machine learning integration
- [ ] Advanced visualization tools
- [ ] User customization options

### Phase 4: Polish & Optimization
- [ ] Performance optimization
- [ ] Advanced animations
- [ ] Mobile app development
- [ ] API documentation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For questions, suggestions, or support, please open an issue or contact the development team.

---

**Built with ❤️ for the Bitcoin community**