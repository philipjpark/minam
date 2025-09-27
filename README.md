# Minam — Creating API data never looked so good

Minam lets companies and retailers **package data into model-ready APIs**. Providers upload data, pick a **Model Profile** (what features a target model expects), and Minam's agentic pipeline **validates, normalizes, documents, and publishes** a versioned API that buyers (prop firms, HFs, power-retail) can call.

- **Rust (Axum) API** — fast, type‑safe core, agent pipeline, in‑memory store (swap for Postgres later).
- **Next.js + Tailwind** — 2‑page app (Ticket Line / Alpha Kitchen vibe) for *upload → structure → publish*.
- **Zod Schemas + SDK** — shared contracts and a tiny TS client.

> Premise: Providers sell **consumption-priced APIs** (open/closed/paid). Buyers don’t wrangle un/structured data—
> they consume **vetted endpoints** aligned to model capabilities (e.g., GPT‑5, Codex, or any profile you define).

## Quick Start

### API (Rust)
```bash
cd apps/api
cargo run
# API at http://localhost:8787
```

### Web (Next.js)
```bash
cd apps/web
pnpm i || npm i
pnpm dev || npm run dev
# UI at http://localhost:3000
```

### SDK demo
```ts
import { MinamClient } from "@minam/sdk";
const c = new MinamClient({ baseUrl: "http://localhost:8787" });
await c.createProvider({ name: "Acme Retail", contactEmail: "ops@acme.test" });
```

## Architecture (high-level)

```
packages/
  schemas/        # Zod contracts shared by web + sdk
  sdk/            # Tiny fetch client
apps/
  api/            # Rust (axum) service with agentic pipeline and marketplace
  web/            # Next.js app (2 pages: Create & Publish)
data/examples/    # Provider configs & manifests
pipeline/examples # YAML-like recipe for agents
```

### Agents (Kitchen Staff metaphor)

- **Host**: Auth/wallet/API keys; provider identity
- **Sommelier**: Selects Model Profile (target model + feature schema)
- **Sous‑Chef**: Ingests raw data (CSV/JSON), normalizes to feature bus
- **Line Cook**: Maps columns → features, imputes, validates
- **Health Inspector**: Evals: coverage, nulls, drift, PII, license checks
- **Runner**: Publishes versioned API, rate limits, pricing
- **Expediter**: Orchestrates the pipeline, approvals (HITL)
- **Dishwasher**: Logs, lineage, cost reports

## Human‑in‑the‑Loop
A publish requires a **green pass** on automated checks **and** a human approval note. The UI exposes diffs and sample rows before “Go Live”.

## Notes
- Storage is in‑memory (DashMap). Replace with Postgres/SQLite by swapping the `Store` in `apps/api/src/state.rs`.
- The API publishes a mock **/v1/data/{api_id}/query** endpoint that filters by time/symbol and projects features required by the selected Model Profile.
- Model Profiles included: **gpt5-trade-signal@1**, **codex-feature-gen@1** (examples).
