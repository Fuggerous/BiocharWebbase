# BiocharWebbase

BiocharWebbase is a browser-based biochar research and decision-support platform focused on CO₂ adsorption, biochar property estimation, and data-driven material selection. It combines a curated experimental database, interactive analytics, and machine-learning-based prediction tools into a single React/Vite application.

## What this project does

- Browses a biochar experimental database
- Predicts CO₂ adsorption outcomes using an in-browser estimator
- Estimates key biochar properties with ML-assisted workflows
- Helps users compare feedstocks, process conditions, and material performance
- Provides supporting context, scientific background, and research references
- Keeps the entire user experience lightweight and browser-first

## Key features

- **Home dashboard** with platform overview, science context, and feature highlights
- **Database explorer** for browsing experimental records
- **CO₂ predictor** for estimating adsorption-related outcomes
- **Results view** for reviewing model outputs and comparisons
- **Materials advisor** to help with material selection and interpretation
- **Property estimator** for predicting biochar properties
- **Share data** workflow for contributing datasets
- **About page** describing mission, team, and milestones

## Application structure

The app is a React single-page application powered by Vite and React Router.

Main routes:

- `/` — Home
- `/database` — Experimental database browser
- `/predictor` — CO₂ adsorption predictor
- `/results` — Prediction and analysis results
- `/share` — Data submission / contribution flow
- `/about` — Project background and mission
- `/advisor` — Materials advisor
- `/property-estimator` — Biochar property estimator

## Tech stack

- **React 18**
- **Vite**
- **React Router**
- **TanStack Query**
- **Tailwind CSS**
- **Radix UI components**
- **Framer Motion** for animation
- **Recharts** for visualization
- **React Hook Form** + **Zod** for form handling and validation
- **Leaflet** and other scientific/UI libraries for rich interactions

## Data and ML workflow

The repo includes a local data and model generation pipeline.

The update script is the main entry point:

- `update_website.py` regenerates the database
- trains property-estimation and CO₂-estimation models
- exports predictions for the website

Generated artifacts are stored in the app so the site can run entirely from static/browser-delivered assets.

## Project layout

- `src/pages/` — top-level route pages
- `src/components/` — reusable UI and page sections
- `src/lib/` — data, model helpers, and shared utilities
- `Database/` — source data and database-related assets
- `update_website.py` — full update / training / export pipeline

## Getting started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint and type-check

```bash
npm run lint
npm run typecheck
```

## Maintenance workflow

If you update the database or model outputs, use the update script:

```bash
python update_website.py
```

Optional modes:

- `python update_website.py --ml` — retrain ML only
- `python update_website.py --export` — export predictions only

## User guide

### 1) Start on the home page

The home page introduces the platform and routes users to the database, predictor, and research context sections.

### 2) Explore the database

Use the database page to inspect experimental records, compare biochar materials, and understand what data is available for modeling.

### 3) Run predictions

Open the predictor to estimate CO₂ adsorption behavior from the parameters you provide.

### 4) Review results

Check the results page for model outputs, summaries, and comparisons.

### 5) Use the materials advisor

The advisor is designed to help interpret which biochar choices may be appropriate for a given use case.

### 6) Estimate properties

Use the property estimator when you want predicted values for key biochar characteristics.

### 7) Contribute data

If you have relevant experimental data, use the share page to contribute it back to the platform.

## Notes for contributors and maintainers

- This repository is structured as a browser-first research tool rather than a server-heavy web app.
- Several components rely on generated local assets under `src/lib/`.
- The `AuthContext` is intentionally stubbed because authentication is not used in the current standalone setup.
- The project appears to emphasize open scientific access, reproducibility, and static deployability.

## Recommended next step

If you want, I can also create a **second markdown file** called `USER_GUIDE.md` with a much deeper, step-by-step walkthrough of every page and workflow in the app.