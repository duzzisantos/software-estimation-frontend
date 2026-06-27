# Software Project Estimator — Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=recharts&logoColor=white)

**Interactive dashboard for visualizing software project estimation analysis — PERT simulations, LSTM time-series forecasts, and regression modeling.**

</div>

---

## Overview

The frontend for the Software Project Estimator system. It connects to the training and data services to render statistical analysis of work log data, helping teams identify estimation bias patterns and make data-driven project planning decisions.

---

## Dashboard

```
┌──────────────────────────────────────────────────────────────────────┐
│  ┌────────┐  Software Project Estimator          [Theme] [Profile]  │
│  │  Logo  │                                                         │
│  └────────┘                                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│   │ PERT Analysis│  │ Time Series  │  │ Multilinear Regression   │  │
│   └──────┬───────┘  └──────────────┘  └──────────────────────────┘  │
│          │                                                           │
│   ┌──────▼───────────────────────────────────────────────────────┐  │
│   │                                                               │  │
│   │   ┌─────────────────┐    ┌────────────────────────────────┐  │  │
│   │   │  Task Selector  │    │     Monte Carlo Histogram      │  │  │
│   │   │  ☑ Database     │    │     ▓▓▓▓▓▓▓▓                  │  │  │
│   │   │  ☑ API Setup    │    │   ▓▓▓▓▓▓▓▓▓▓▓▓                │  │  │
│   │   │  ☐ Security     │    │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │  │  │
│   │   │  ☐ DevOps       │    │   ▓▓▓▓▓▓▓▓▓▓▓▓                │  │  │
│   │   │  ...            │    │     ▓▓▓▓▓▓▓▓                  │  │  │
│   │   └─────────────────┘    └────────────────────────────────┘  │  │
│   │                                                               │  │
│   │   ┌─────────┐  ┌───────────┐  ┌──────────────┐              │  │
│   │   │  Mean   │  │  Std Dev  │  │    P90       │              │  │
│   │   │  11.7h  │  │  3.12h    │  │   15.8h     │              │  │
│   │   └─────────┘  └───────────┘  └──────────────┘              │  │
│   │                                                               │  │
│   └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Features

### Three Analysis Modes

| Tab | Model | Visualization | Description |
|-----|-------|---------------|-------------|
| **PERT Analysis** | Monte Carlo Simulation | Distribution histogram (40 bins) + stat cards | Select tasks, input optimistic/most-likely/pessimistic times, view probability distribution |
| **Time Series** | LSTM Neural Network | Multi-line chart across training periods | Submit work logs, trigger retraining, view predicted durations over time |
| **Multilinear Regression** | Linear Regression | Coefficient bars + scatter + residuals | View feature importance, R² score, predicted vs actual, residual distribution |

### Core Capabilities

```
Authentication                 Visualization               Interaction
──────────────                 ─────────────               ───────────
API Key + Unlock Key           Recharts library            Task multi-select
SHA-256 credential hashing     Bar / Line / Scatter        Task filter toggle
Session-based persistence      Distribution histograms     Model retraining trigger
                               Stat cards                  Theme switching (light/dark)
```

---

## Analysis Tabs

### PERT Analysis

Applies the Program Evaluation and Review Technique to estimate task durations under uncertainty.

**Inputs:**
- Select one or more tasks from the 29 standardized categories
- Provide optimistic, most likely, and pessimistic time estimates

**Outputs:**
- Monte Carlo histogram (10,000 simulations, 40 bins)
- Mean duration, standard deviation, 90th percentile
- Results summary table

### Time Series Forecasting

Displays LSTM-predicted task durations from historical training runs.

**Features:**
- Line chart showing predicted durations across the last 6 training periods
- Per-task filtering to isolate specific categories
- Retrain button to trigger a new LSTM training cycle
- Work log submission for selected tasks

### Multilinear Regression

Reveals which task categories most influence total project duration.

**Visualizations:**
- **Coefficient chart** — horizontal bar chart ranking task influence
- **Predicted vs Actual** — scatter plot showing model accuracy
- **Residuals** — bar chart of prediction errors
- **Top 10 table** — most influential features with coefficient values
- **Summary cards** — R² score, intercept, mean residual, training count

---

## Task Categories

The system tracks **29 standardized subtask types**:

```
┌─────────────── Backend ───────────────┐  ┌────────────── Frontend ──────────────┐
│                                       │  │                                      │
│  Database         Server Management   │  │  Styling          Data Display       │
│  Security         API Setup           │  │  UI/UX            Data Visualization │
│  Validation       API Integration     │  │  Frontend Testing Access Control     │
│  DevOps           Data Backup         │  │  API Logic        SEO                │
│  Backend Testing  Data Structure      │  │  Form Setup       Widget Setup       │
│  Machine Learning Scalability         │  │  Table Setup      CI/CD              │
│  Optimization     Cloud               │  │  Layout Setup     Deployment         │
│                                       │  │  CMS Integration                     │
└───────────────────────────────────────┘  └──────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript 5.5 |
| Build | Vite 5.4 |
| Styling | Tailwind CSS 3.4 |
| Charts | Recharts 3.9 |
| UI Primitives | Radix UI (Tabs, Checkbox, Dropdown, Avatar) |
| Notifications | Sonner 2.0 |
| Icons | Lucide React |

---

## Quick Start

```bash
# Install
npm install

# Development
npm run dev
# → http://localhost:5173

# Build
npm run build
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL_TRAINING` | Yes | Training service base URL |
| `VITE_API_URL_CRUD` | Yes | Data/CRUD service base URL |
| `VITE_API_KEY_HASH` | Yes | SHA-256 hash of the API key |
| `VITE_UNLOCK_KEY_HASH` | Yes | SHA-256 hash of the unlock key |

---

## Project Structure

```
src/
├── layout/                    Analysis tab views
│   ├── PERT.tsx               Monte Carlo simulation view
│   ├── TimeSeries.tsx         LSTM forecast view
│   └── MultilinearRegression.tsx  Regression analysis view
│
├── components/                Shared UI
│   ├── ui/                    Radix-based primitives
│   ├── analysis-card.tsx      Chart wrapper card
│   ├── stat-card.tsx          Metric display card
│   ├── task-filter.tsx        Task toggle filter
│   ├── task-multiselect.tsx   Multi-task selector
│   ├── login-page.tsx         Authentication page
│   ├── theme-toggle.tsx       Light/dark mode switch
│   └── user-profile.tsx       Profile dropdown
│
├── utils/                     Data & hooks
│   ├── usePertAnalysis.ts     PERT data fetching hook
│   ├── useTimeSeriesData.ts   Time series data hook
│   ├── useRegressionData.ts   Regression data hook
│   ├── useAuth.ts             Authentication hook
│   ├── fetchDataTraining.ts   Training API client
│   ├── chartConfig.ts         Chart color/style config
│   ├── data.ts                Task labels & constants
│   └── formatDate.ts          Date formatting utilities
│
└── App.tsx                    Root component with tab navigation
```

---

## License

[MIT](LICENSE)
