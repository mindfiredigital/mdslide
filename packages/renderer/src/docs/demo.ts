import { writeFileSync } from 'fs';
import { parse } from '@mindfiredigital/mdslide-parser';
import { renderDeck } from '../html.js';

const md = `---
title: InvenTrack — Inventory Management System
theme: dark
---

# InvenTrack
### A modern inventory management system built for scale

## The Problem

<!-- notes -->
Start with the pain points. Ask the audience how many use spreadsheets.
<!-- /notes -->

- Businesses lose **$1.1 trillion** annually due to poor inventory control
- Teams rely on spreadsheets that break, drift, and go out of sync
- No real-time visibility across warehouses and locations
- Manual reorder points lead to stockouts or overstock

## What InvenTrack Solves

<!-- layout: bullets -->

<!-- notes -->
Keep this slide punchy. One sentence per point max.
<!-- /notes -->

- Real-time stock tracking across multiple locations
- Automated low-stock alerts and reorder triggers
- Full audit trail for every stock movement
- Barcode and QR code scanning support
- Role-based access for warehouse staff and managers

## System Architecture

\`\`\`mermaid
graph TD
  Client["Client (React)"] --> Gateway["API Gateway (Express + JWT)"]
  Gateway --> Inventory["Inventory Service"]
  Gateway --> Orders["Order Service"]
  Gateway --> Alerts["Alert Service"]
  Inventory --> DB["PostgreSQL"]
  Orders --> DB
  Alerts --> Cache["Redis Cache"]
\`\`\`

## Core Data Model

\`\`\`ts
interface Product {
  id: string
  sku: string
  name: string
  category: string
  quantity: number
  reorderPoint: number
  unitCost: number
  location: string
  lastUpdated: Date
}
\`\`\`

## Stock Movement Types

| Movement | Trigger | Audit |
|---|---|---|
| Inbound | Purchase order received | yes |
| Outbound | Sale or dispatch | yes |
| Transfer | Location to location | yes |
| Adjustment | Manual correction | yes |
| Write-off | Damage or expiry | yes |

## Low Stock Alert Flow

<!-- notes -->
Walk through the flow step by step. Mention that alerts go to Slack and email.
<!-- /notes -->

\`\`\`mermaid
flowchart TD
  A["Stock update received"] --> B{"quantity < reorderPoint?"}
  B -->|yes| C["Alert Service triggered"]
  C --> D["Notification sent (email + Slack)"]
  D --> E["Draft purchase order created"]
  B -->|no| F["No action"]
\`\`\`

## Tech Stack

<!-- layout: bullets -->

- **Frontend** — React 18, TypeScript, Tailwind CSS
- **Backend** — Node.js, Express, Prisma ORM
- **Database** — PostgreSQL (primary), Redis (cache + queues)
- **Auth** — JWT with refresh token rotation
- **Infra** — Docker, GitHub Actions CI/CD
- **Monitoring** — Grafana + Prometheus

## Performance Targets

| Metric | Target | Current |
|---|---|---|
| Stock query response | < 50ms | 38ms |
| Bulk import (10k rows) | < 5s | 3.2s |
| Alert delivery | < 30s | 12s |
| Dashboard load | < 1s | 0.7s |

## Security Model

<!-- notes -->
Emphasise the audit trail here — compliance teams love this.
<!-- /notes -->

- All routes protected via JWT middleware
- Role-based permissions — viewer, operator, manager, admin
- Every stock mutation logged with user, timestamp, and delta
- Rate limiting on all public endpoints
- Data encrypted at rest and in transit

## API Example

\`\`\`ts
// GET /api/products?lowStock=true
const response = await fetch('/api/products?lowStock=true', {
  headers: { Authorization: \`Bearer \${token}\` },
});

const { products } = await response.json();
// returns products where quantity < reorderPoint
\`\`\`

## Deployment Pipeline

\`\`\`mermaid
flowchart LR
  Dev["Developer Push"] --> CI["GitHub Actions CI"]
  CI --> Test["Run Tests"]
  Test --> Build["Docker Build"]
  Build --> Registry["Container Registry"]
  Registry --> Prod["Production Deploy"]
\`\`\`

## Roadmap

<!-- layout: bullets -->

-  **v1.0** — Core inventory CRUD + auth
- **v1.1** — Multi-location support
-  **v1.2** — Barcode scanning + mobile app
-  **v1.3** — Supplier portal + purchase orders
-  **v2.0** — AI-powered demand forecasting

## Why InvenTrack

> Built by warehouse operators, not just engineers. Every feature came from a real pain point on the floor.

## Open Source. MIT Licensed.

\`\`\`bash
pnpm add @mindfiredigital/inventrack
\`\`\`

**github.com/mindfiredigital/inventrack**

# Thank You

> Simple tools for people who write good software.

### Built with Markdown. Presented with mdslide.

**github.com/mindfiredigital/mdslide**
`;

const deck = parse(md);

(async () => {
  try {
    const html = await renderDeck(deck, { theme: 'dark' });
    writeFileSync('demo.html', html);
    console.log(` wrote demo.html — ${deck.slides.length} slides`);
  } catch (error) {
    console.error(' Failed to render deck:', error);
    process.exit(1);
  }
})();
