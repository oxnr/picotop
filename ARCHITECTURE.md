# Picojeet Architecture

A comprehensive architectural overview of Picojeet - the sophisticated Bitcoin cycle prediction platform delivering actionable trading signals through advanced on-chain analytics.

## 🏗️ System Overview

Picojeet is architected as a modern, real-time analytics platform using Next.js 15 with a focus on accurate cycle prediction, beautiful visualizations, and seamless multi-source data integration.

```mermaid
graph TB
    subgraph "Client Layer - Picojeet Frontend"
        UI[React Components + Framer Motion]
        Charts[Recharts Visualizations]
        Theme[Dark/Light Mode System]
        Cache[React Query Cache]
    end
    
    subgraph "Next.js 15 Application Layer"
        AppRouter[App Router]
        API[API Routes]
        SSR[Server-Side Rendering]
        EdgeFunctions[Edge Functions]
    end
    
    subgraph "Data Integration Layer"
        BitcoinAPI[Bitcoin Metrics APIs]
        AppStoreAPI[App Store Rankings]
        PredictionEngine[Cycle Prediction Engine]
        RealTimeData[Real-time Data Processing]
    end
    
    subgraph "External Data Sources"
        CoinGecko[CoinGecko API]
        Coinpaprika[Coinpaprika API]
        FearGreed[Fear & Greed Index]
        AppStore[iOS/Android App Stores]
    end
    
    UI --> Charts
    Charts --> Theme
    Theme --> Cache
    UI --> AppRouter
    AppRouter --> API
    API --> SSR
    SSR --> EdgeFunctions
    API --> BitcoinAPI
    API --> AppStoreAPI
    API --> PredictionEngine
    BitcoinAPI --> CoinGecko
    BitcoinAPI --> Coinpaprika
    AppStoreAPI --> AppStore
    PredictionEngine --> FearGreed
    Cache --> RealTimeData
```

## 🎯 Core Features & Architecture

### Bitcoin Cycle Prediction Engine

```mermaid
graph TB
    subgraph "Historical Data Analysis"
        HistoricalHigh[Historical Monthly Highs]
        PatternRecognition[Pattern Recognition]
        CycleMapping[Cycle Mapping]
        VolatilityAnalysis[Volatility Analysis]
    end
    
    subgraph "Prediction Models"
        PiCycle[Pi Cycle Top Model]
        Rainbow[Rainbow Chart Analysis]
        NUPL[NUPL Cycle Analysis]
        AppCorrelation[App Ranking Correlation]
    end
    
    subgraph "Output Predictions"
        CycleTop[Predicted Cycle Top]
        PriceTarget[$132K Target]
        TimingPrediction[Timing Predictions]
        ActionableSignals[Actionable Signals]
    end
    
    HistoricalHigh --> PiCycle
    PatternRecognition --> Rainbow
    CycleMapping --> NUPL
    VolatilityAnalysis --> AppCorrelation
    
    PiCycle --> CycleTop
    Rainbow --> PriceTarget
    NUPL --> TimingPrediction
    AppCorrelation --> ActionableSignals
```

### Real-time Chart System

```mermaid
sequenceDiagram
    participant User
    participant Chart
    participant API
    participant Prediction
    participant External
    
    User->>Chart: View Bitcoin Chart
    Chart->>API: Request Latest Data
    API->>External: Fetch Bitcoin Price
    API->>External: Get Historical Data
    
    External->>API: Return Market Data
    API->>Prediction: Calculate Predictions
    Prediction->>API: Generate Future Points
    API->>Chart: Return Chart Data
    Chart->>User: Display Enhanced Chart
    
    Note over Chart,User: Real-time price updates
    Note over Chart,User: Historical highs + current + predictions
```

## 🎨 Component Architecture

### Enhanced Chart System

```mermaid
graph TB
    subgraph "Chart Components"
        EnhancedBitcoin[Enhanced Bitcoin Chart]
        Rainbow[Visual Rainbow Chart]
        NUPL[Visual NUPL Chart]
        SOPR[Visual SOPR Chart]
        MVRV[Visual MVRV Chart]
        MiniChart[Mini Chart Component]
    end
    
    subgraph "Chart Features"
        HistoricalLine[Historical Price Line - Blue]
        CurrentPoint[Current Price Point - Purple]
        PredictionLine[Prediction Line - Orange Dashed]
        InteractiveTooltips[Interactive Tooltips]
    end
    
    subgraph "Data Processing"
        MonthlyHighs[Monthly High Values]
        DynamicCurrent[Dynamic Current Month]
        PredictionAlgorithm[Prediction Algorithm]
        LabelAlignment[Proper Label Alignment]
    end
    
    EnhancedBitcoin --> HistoricalLine
    EnhancedBitcoin --> CurrentPoint
    EnhancedBitcoin --> PredictionLine
    Rainbow --> InteractiveTooltips
    
    MonthlyHighs --> HistoricalLine
    DynamicCurrent --> CurrentPoint
    PredictionAlgorithm --> PredictionLine
    LabelAlignment --> InteractiveTooltips
```

### Dashboard Layout System

```mermaid
graph TB
    subgraph "Layout Components"
        AppLayout[App Layout Wrapper]
        Header[Header with Branding]
        Sidebar[Collapsible Sidebar]
        Footer[Footer Component]
    end
    
    subgraph "Dashboard Sections"
        LiveDashboard[Live Dashboard]
        StatsCards[Stats Cards Grid]
        MetricCards[Metric Cards]
        BRRRVideo[BRRR Video Component]
    end
    
    subgraph "Interactive Elements"
        ThemeToggle[Theme Toggle]
        MobileMenu[Mobile Menu]
        ScrollAnimations[Scroll Animations]
        HoverEffects[Hover Effects]
    end
    
    AppLayout --> Header
    AppLayout --> Sidebar
    AppLayout --> Footer
    
    LiveDashboard --> StatsCards
    LiveDashboard --> MetricCards
    LiveDashboard --> BRRRVideo
    
    Header --> ThemeToggle
    Sidebar --> MobileMenu
    StatsCards --> ScrollAnimations
    MetricCards --> HoverEffects
```

## 📊 Cycle Prediction Algorithm

### Mathematical Model

```mermaid
graph TB
    subgraph "Input Variables"
        CurrentPrice[Current Price: $105,722]
        HistoricalData[Historical Monthly Highs]
        CyclePosition[Current Cycle Position]
        VolatilityFactors[Volatility Factors]
    end
    
    subgraph "Calculation Engine"
        BaseTarget[Base Target = Current × 1.25]
        CycleAdjustment[Cycle Position Adjustment]
        VolatilitySmoothing[Volatility Smoothing]
        PatternMatching[Pattern Matching]
    end
    
    subgraph "Output Prediction"
        PredictedPeak[Predicted Peak: $132K]
        PeakTiming[Peak Timing: 6 months]
        ConfidenceLevel[Confidence Level: High]
        ActionSignal[Action Signal: ACCUMULATE]
    end
    
    CurrentPrice --> BaseTarget
    HistoricalData --> CycleAdjustment
    CyclePosition --> VolatilitySmoothing
    VolatilityFactors --> PatternMatching
    
    BaseTarget --> PredictedPeak
    CycleAdjustment --> PeakTiming
    VolatilitySmoothing --> ConfidenceLevel
    PatternMatching --> ActionSignal
```

### Prediction Formula

The core prediction algorithm uses the following formula:

```
Predicted Peak = Current Price × Growth Factor × Cycle Multiplier × Volatility Dampener

Where:
- Growth Factor = 1.25 (base 25% growth expectation)
- Cycle Multiplier = f(months_to_peak, historical_patterns)
- Volatility Dampener = sin(cycle_position) × volatility_constant
- Peak Timing = 6 months from current (based on cycle analysis)
```

## 📱 App Store Integration Architecture

### Retail Interest Tracking

```mermaid
graph TB
    subgraph "Data Sources"
        AppStoreAPI[App Store Connect API]
        GooglePlayAPI[Google Play Console API]
        RankingServices[Third-party Ranking Services]
        ManualTracking[Manual Verification]
    end
    
    subgraph "Tracked Applications"
        Coinbase[Coinbase - Primary Indicator]
        Phantom[Phantom Wallet]
        TrustWallet[Trust Wallet]
        MetaMask[MetaMask]
        CryptoApps[Other Crypto Apps]
    end
    
    subgraph "Analysis Engine"
        RankingTrends[Ranking Trend Analysis]
        CorrelationEngine[Price Correlation Engine]
        RetailSentiment[Retail Sentiment Scoring]
        CycleIndicator[Cycle Position Indicator]
    end
    
    AppStoreAPI --> Coinbase
    GooglePlayAPI --> Phantom
    RankingServices --> TrustWallet
    ManualTracking --> MetaMask
    
    Coinbase --> RankingTrends
    Phantom --> CorrelationEngine
    TrustWallet --> RetailSentiment
    MetaMask --> CycleIndicator
```

## 🎨 Theme System Architecture

### Dual Theme Implementation

```mermaid
graph TB
    subgraph "Theme Provider System"
        ThemeContext[Next Themes Context]
        CSSVariables[CSS Custom Properties]
        TailwindConfig[Tailwind CSS Configuration]
        SystemDetection[System Preference Detection]
    end
    
    subgraph "Dark Mode (Primary)"
        DarkBackground[Dark Backgrounds]
        DarkText[Light Text on Dark]
        DarkCharts[Dark Chart Themes]
        DarkAccents[Blue/Purple Accents]
    end
    
    subgraph "Light Mode (Enhanced)"
        LightBackground[Light Backgrounds]
        LightText[Dark Text on Light]
        LightCharts[Light Chart Themes]
        LightAccents[Adjusted Accents]
    end
    
    subgraph "Component Integration"
        ConditionalClasses[Conditional CSS Classes]
        ChartTheming[Chart Theme Switching]
        IconAdaptation[Icon Color Adaptation]
        AnimationConsistency[Animation Consistency]
    end
    
    ThemeContext --> CSSVariables
    CSSVariables --> TailwindConfig
    TailwindConfig --> SystemDetection
    
    SystemDetection --> DarkBackground
    SystemDetection --> LightBackground
    
    DarkBackground --> ConditionalClasses
    LightBackground --> ConditionalClasses
    DarkCharts --> ChartTheming
    LightCharts --> ChartTheming
```

## 🚀 Performance Optimization

### Frontend Optimization Strategy

```mermaid
graph TB
    subgraph "Code Optimization"
        CodeSplitting[Dynamic Imports & Code Splitting]
        TreeShaking[Tree Shaking]
        BundleOptimization[Bundle Size Optimization]
        ComponentLazyLoading[Component Lazy Loading]
    end
    
    subgraph "Data Optimization"
        ReactQuery[React Query Caching]
        APIResponseCaching[API Response Caching]
        StaticGeneration[Static Site Generation]
        IncrementalRegeneration[Incremental Static Regeneration]
    end
    
    subgraph "Runtime Optimization"
        ChartPerformance[Chart Rendering Optimization]
        AnimationPerformance[Framer Motion Optimization]
        MemoryManagement[Memory Leak Prevention]
        ImageOptimization[Next.js Image Optimization]
    end
    
    CodeSplitting --> ReactQuery
    TreeShaking --> APIResponseCaching
    BundleOptimization --> StaticGeneration
    ComponentLazyLoading --> IncrementalRegeneration
    
    ReactQuery --> ChartPerformance
    APIResponseCaching --> AnimationPerformance
    StaticGeneration --> MemoryManagement
    IncrementalRegeneration --> ImageOptimization
```

## 🔐 Security & Reliability

### Security Implementation

```mermaid
graph TB
    subgraph "Frontend Security"
        ContentSecurityPolicy[Content Security Policy]
        HTTPSEnforcement[HTTPS Enforcement]
        InputValidation[Input Validation & Sanitization]
        XSSProtection[XSS Protection]
    end
    
    subgraph "API Security"
        RateLimiting[Rate Limiting]
        CORSConfiguration[CORS Configuration]
        RequestValidation[Request Validation]
        ErrorHandling[Secure Error Handling]
    end
    
    subgraph "Data Protection"
        NoSensitiveStorage[No Sensitive Data Storage]
        PublicAPIOnly[Public API Usage Only]
        TransparentOperations[Transparent Operations]
        ClientSideProcessing[Client-side Processing]
    end
    
    ContentSecurityPolicy --> RateLimiting
    HTTPSEnforcement --> CORSConfiguration
    InputValidation --> RequestValidation
    XSSProtection --> ErrorHandling
    
    RateLimiting --> NoSensitiveStorage
    CORSConfiguration --> PublicAPIOnly
    RequestValidation --> TransparentOperations
    ErrorHandling --> ClientSideProcessing
```

## 🎯 Technical Specifications

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.4+ with CSS Variables
- **Charts**: Recharts 2.8+ with custom components
- **Animations**: Framer Motion 11+
- **State Management**: React Query (TanStack Query)
- **Theme System**: next-themes with system detection
- **Deployment**: Vercel with Edge Functions
- **Package Manager**: Yarn 1.22+

### API Integration

- **Bitcoin Data**: BGeo Metrics API (primary), CoinGecko API, Coinpaprika API
- **On-chain Metrics**: BGeo Metrics for NUPL, SOPR, MVRV, and Bitcoin dominance
- **App Store Data**: App Store Connect API, Google Play Console API
- **Market Sentiment**: Fear & Greed Index API
- **Real-time Updates**: 30-second polling intervals
- **Caching Strategy**: React Query with 5-minute cache TTL
- **Error Handling**: Graceful fallbacks and retry logic

This architecture ensures Picojeet delivers enterprise-grade reliability while maintaining an innovative, user-friendly experience. The platform is designed to scale with user growth while continuously improving prediction accuracy through advanced analytics and real-time data integration.