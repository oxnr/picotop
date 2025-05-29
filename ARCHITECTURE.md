# CycleTop Architecture

This document provides a comprehensive overview of the CycleTop application architecture, including system design, data flow, and component structure.

## 🏗️ System Overview

CycleTop is built as a modern, scalable web application using Next.js with a focus on real-time data processing and beautiful user interfaces.

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Components]
        State[State Management]
        Cache[Client Cache]
    end
    
    subgraph "Next.js Application"
        Pages[Pages/Routes]
        API[API Routes]
        MW[Middleware]
    end
    
    subgraph "Data Layer"
        DB[(Database)]
        Redis[(Redis Cache)]
        Storage[(File Storage)]
    end
    
    subgraph "External APIs"
        AppStore[App Store APIs]
        Bitcoin[Bitcoin Metrics APIs]
        OnChain[On-chain Data]
    end
    
    UI --> State
    State --> Cache
    UI --> Pages
    Pages --> API
    API --> MW
    MW --> DB
    MW --> Redis
    API --> AppStore
    API --> Bitcoin
    API --> OnChain
    DB --> Storage
```

## 🎯 Application Architecture

### Frontend Architecture

```mermaid
graph TB
    subgraph "App Router (Next.js 15)"
        Layout[Root Layout]
        Dashboard[Dashboard Pages]
        Metrics[Metrics Pages]
        Settings[Settings Pages]
    end
    
    subgraph "Component Library"
        UI[Base UI Components]
        Charts[Chart Components]
        Forms[Form Components]
        Layout_Components[Layout Components]
    end
    
    subgraph "State Management"
        Context[React Context]
        Query[React Query]
        LocalState[Local State]
    end
    
    subgraph "Utilities"
        API_Client[API Client]
        Utils[Helper Functions]
        Types[TypeScript Types]
        Constants[Constants]
    end
    
    Layout --> Dashboard
    Layout --> Metrics
    Layout --> Settings
    
    Dashboard --> UI
    Dashboard --> Charts
    Metrics --> Charts
    Settings --> Forms
    
    UI --> Context
    Charts --> Query
    Forms --> LocalState
    
    Query --> API_Client
    API_Client --> Utils
    Utils --> Types
```

### Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant Cache
    participant External
    participant DB
    
    User->>UI: Interact with Dashboard
    UI->>API: Request Data
    API->>Cache: Check Cache
    
    alt Cache Hit
        Cache->>API: Return Cached Data
    else Cache Miss
        API->>External: Fetch External Data
        External->>API: Return Data
        API->>Cache: Store in Cache
        API->>DB: Store Historical Data
    end
    
    API->>UI: Return Data
    UI->>User: Display Updated UI
```

## 📊 Data Sources Integration

### App Store Rankings

```mermaid
graph LR
    subgraph "App Store Data Pipeline"
        iOS[iOS App Store API]
        Android[Google Play API]
        ThirdParty[Third-party Analytics]
    end
    
    subgraph "Data Processing"
        Aggregator[Data Aggregator]
        Normalizer[Data Normalizer]
        Ranker[Ranking Calculator]
    end
    
    subgraph "Storage"
        Rankings[(Rankings DB)]
        Trends[(Trends DB)]
    end
    
    iOS --> Aggregator
    Android --> Aggregator
    ThirdParty --> Aggregator
    
    Aggregator --> Normalizer
    Normalizer --> Ranker
    
    Ranker --> Rankings
    Ranker --> Trends
```

### Bitcoin Metrics Pipeline

```mermaid
graph TB
    subgraph "Data Sources"
        Glassnode[Glassnode API]
        IntoTheBlock[IntoTheBlock API]
        Exchanges[Exchange APIs]
        OnChain[On-chain Data]
    end
    
    subgraph "Processing Layer"
        Collector[Data Collector]
        Validator[Data Validator]
        Calculator[Metrics Calculator]
    end
    
    subgraph "Metrics"
        NUPL[NUPL Calculator]
        SOPR[SOPR Calculator]
        MVZR[MVZR Calculator]
        Rainbow[Rainbow Chart]
        Custom[Custom Metrics]
    end
    
    subgraph "Storage"
        TimeSeries[(Time Series DB)]
        Processed[(Processed Metrics)]
    end
    
    Glassnode --> Collector
    IntoTheBlock --> Collector
    Exchanges --> Collector
    OnChain --> Collector
    
    Collector --> Validator
    Validator --> Calculator
    
    Calculator --> NUPL
    Calculator --> SOPR
    Calculator --> MVZR
    Calculator --> Rainbow
    Calculator --> Custom
    
    NUPL --> TimeSeries
    SOPR --> TimeSeries
    MVZR --> TimeSeries
    Rainbow --> TimeSeries
    Custom --> Processed
```

## 🎨 Component Architecture

### UI Component Hierarchy

```mermaid
graph TB
    subgraph "Layout Components"
        AppLayout[App Layout]
        Header[Header]
        Sidebar[Sidebar]
        Footer[Footer]
    end
    
    subgraph "Page Components"
        Dashboard[Dashboard]
        MetricsPage[Metrics Page]
        SettingsPage[Settings Page]
    end
    
    subgraph "Feature Components"
        MetricCard[Metric Card]
        ChartContainer[Chart Container]
        RankingList[Ranking List]
        AlertPanel[Alert Panel]
    end
    
    subgraph "Base UI Components"
        Button[Button]
        Card[Card]
        Modal[Modal]
        Table[Table]
        Chart[Chart]
    end
    
    AppLayout --> Header
    AppLayout --> Sidebar
    AppLayout --> Footer
    
    AppLayout --> Dashboard
    AppLayout --> MetricsPage
    AppLayout --> SettingsPage
    
    Dashboard --> MetricCard
    Dashboard --> ChartContainer
    MetricsPage --> RankingList
    Dashboard --> AlertPanel
    
    MetricCard --> Card
    ChartContainer --> Chart
    RankingList --> Table
    AlertPanel --> Modal
```

### State Management Flow

```mermaid
graph TB
    subgraph "Global State"
        Theme[Theme Context]
        User[User Context]
        Settings[Settings Context]
    end
    
    subgraph "Data State"
        Metrics[Metrics Query]
        Rankings[Rankings Query]
        Historical[Historical Query]
    end
    
    subgraph "Local State"
        Forms[Form State]
        UI_State[UI State]
        Filters[Filter State]
    end
    
    subgraph "Cache Layer"
        QueryCache[React Query Cache]
        LocalStorage[Local Storage]
        SessionStorage[Session Storage]
    end
    
    Theme --> UI_State
    User --> Settings
    Settings --> Filters
    
    Metrics --> QueryCache
    Rankings --> QueryCache
    Historical --> QueryCache
    
    Forms --> LocalStorage
    UI_State --> SessionStorage
    Filters --> SessionStorage
```

## 🔄 Data Processing Pipeline

### Real-time Data Flow

```mermaid
graph LR
    subgraph "Data Ingestion"
        WebSockets[WebSocket Connections]
        Polling[Scheduled Polling]
        Webhooks[Webhook Endpoints]
    end
    
    subgraph "Processing"
        Queue[Message Queue]
        Workers[Background Workers]
        Validator[Data Validation]
    end
    
    subgraph "Analysis"
        Analyzer[Data Analyzer]
        Predictor[Cycle Predictor]
        Alerter[Alert Engine]
    end
    
    subgraph "Output"
        Dashboard_Update[Dashboard Updates]
        Notifications[Push Notifications]
        API_Response[API Responses]
    end
    
    WebSockets --> Queue
    Polling --> Queue
    Webhooks --> Queue
    
    Queue --> Workers
    Workers --> Validator
    Validator --> Analyzer
    
    Analyzer --> Predictor
    Predictor --> Alerter
    
    Alerter --> Dashboard_Update
    Alerter --> Notifications
    Analyzer --> API_Response
```

### Cycle Prediction Algorithm

```mermaid
graph TB
    subgraph "Input Data"
        AppRankings[App Rankings]
        OnChainMetrics[On-chain Metrics]
        TechnicalIndicators[Technical Indicators]
        MarketSentiment[Market Sentiment]
    end
    
    subgraph "Feature Engineering"
        Normalization[Data Normalization]
        Aggregation[Data Aggregation]
        FeatureSelection[Feature Selection]
    end
    
    subgraph "Model Pipeline"
        Preprocessing[Preprocessing]
        ModelEnsemble[Model Ensemble]
        PostProcessing[Post-processing]
    end
    
    subgraph "Output"
        Prediction[Cycle Top Prediction]
        Confidence[Confidence Score]
        Timing[Timing Estimate]
    end
    
    AppRankings --> Normalization
    OnChainMetrics --> Normalization
    TechnicalIndicators --> Aggregation
    MarketSentiment --> Aggregation
    
    Normalization --> FeatureSelection
    Aggregation --> FeatureSelection
    
    FeatureSelection --> Preprocessing
    Preprocessing --> ModelEnsemble
    ModelEnsemble --> PostProcessing
    
    PostProcessing --> Prediction
    PostProcessing --> Confidence
    PostProcessing --> Timing
```

## 🚀 Deployment Architecture

### Production Environment

```mermaid
graph TB
    subgraph "CDN/Edge"
        CloudFlare[CloudFlare CDN]
        EdgeFunctions[Edge Functions]
    end
    
    subgraph "Application Layer"
        LoadBalancer[Load Balancer]
        NextJS[Next.js Instances]
        API_Gateway[API Gateway]
    end
    
    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL)]
        Redis[(Redis Cluster)]
        S3[(S3 Storage)]
    end
    
    subgraph "External Services"
        DataProviders[Data Providers]
        Analytics[Analytics Services]
        Monitoring[Monitoring]
    end
    
    CloudFlare --> LoadBalancer
    EdgeFunctions --> API_Gateway
    
    LoadBalancer --> NextJS
    API_Gateway --> NextJS
    
    NextJS --> PostgreSQL
    NextJS --> Redis
    NextJS --> S3
    
    NextJS --> DataProviders
    NextJS --> Analytics
    LoadBalancer --> Monitoring
```

## 🔧 Development Workflow

### Build and Deployment Pipeline

```mermaid
graph LR
    subgraph "Development"
        Local[Local Development]
        Testing[Unit Testing]
        Linting[Code Linting]
    end
    
    subgraph "CI/CD"
        GitHooks[Git Hooks]
        Actions[GitHub Actions]
        Building[Build Process]
    end
    
    subgraph "Staging"
        Preview[Preview Deployment]
        E2E[E2E Testing]
        Performance[Performance Testing]
    end
    
    subgraph "Production"
        Deploy[Production Deploy]
        Monitor[Monitoring]
        Rollback[Rollback Capability]
    end
    
    Local --> Testing
    Testing --> Linting
    Linting --> GitHooks
    
    GitHooks --> Actions
    Actions --> Building
    Building --> Preview
    
    Preview --> E2E
    E2E --> Performance
    Performance --> Deploy
    
    Deploy --> Monitor
    Monitor --> Rollback
```

## 📱 Responsive Design Architecture

### Breakpoint Strategy

```mermaid
graph TB
    subgraph "Mobile First Approach"
        Mobile[Mobile: 320px-768px]
        Tablet[Tablet: 768px-1024px]
        Desktop[Desktop: 1024px-1440px]
        Large[Large: 1440px+]
    end
    
    subgraph "Component Adaptation"
        GridSystem[CSS Grid System]
        FlexLayout[Flexbox Layouts]
        AdaptiveComponents[Adaptive Components]
    end
    
    subgraph "Performance"
        LazyLoading[Lazy Loading]
        ImageOptimization[Image Optimization]
        CodeSplitting[Code Splitting]
    end
    
    Mobile --> GridSystem
    Tablet --> FlexLayout
    Desktop --> AdaptiveComponents
    Large --> AdaptiveComponents
    
    GridSystem --> LazyLoading
    FlexLayout --> ImageOptimization
    AdaptiveComponents --> CodeSplitting
```

## 🔐 Security Architecture

### Security Layers

```mermaid
graph TB
    subgraph "Frontend Security"
        CSP[Content Security Policy]
        HTTPS[HTTPS Enforcement]
        InputValidation[Input Validation]
    end
    
    subgraph "API Security"
        RateLimit[Rate Limiting]
        Auth[Authentication]
        CORS[CORS Configuration]
    end
    
    subgraph "Data Security"
        Encryption[Data Encryption]
        Backup[Secure Backups]
        Access[Access Control]
    end
    
    CSP --> RateLimit
    HTTPS --> Auth
    InputValidation --> CORS
    
    RateLimit --> Encryption
    Auth --> Backup
    CORS --> Access
```

This architecture ensures a scalable, maintainable, and performant application that can handle real-time data processing while providing an exceptional user experience.