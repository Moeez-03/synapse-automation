# Synapse — Enterprise Document Operations & Workflow Platform

An enterprise-grade document intelligence and automated workflow platform engineered for legal, compliance, and procurement operations. Built to parse complex multi-page contracts, extract structured attributes against deterministic schemas, identify policy discrepancies, and synchronize verified payloads to ERP systems with auditability.

---

## Key Capabilities & Core Architecture

### 1. Real Multi-Format Document Ingestion & Parsing
* **Native PDF Parsing**: Extracts text layers and page coordinates via client-side `PDF.js` with fallback binary stream extraction.
* **Word Document (.docx) Decompression**: Parses document XML streams and extracts structured paragraphs.
* **Text / RTF / JSON Ingestion**: Instant UTF-8 stream decoding.
* **Native OS File Browser & Drag-and-Drop**: Upload local files directly or test using sample enterprise filings.

### 2. Autonomous Clause & Section Segmentation
* Analyzes raw document syntax to isolate numbered provisions (`Section 1.0`, `Article II`, clauses, bullets, and paragraphs).
* Maps each clause to its original page number and establishes citation anchors for verification.

### 3. Deterministic Entity & Attribute Extraction
Extracts verified contractual attributes directly from document text without model hallucination drift:
* **Contracting Parties**: Preamble entity disambiguation.
* **Effective & Termination Dates**: ISO 8601 standardized date resolution.
* **Financial Value & Ceilings**: Multi-currency detection (`$`, `USD`, `EUR`, `GBP`, `PKR`).
* **Payment Invoicing Terms**: `Net 30`, `Net 45`, `Net 60`, `Monthly Installments`.
* **Governing Jurisdiction**: State or national legal venues (`Delaware`, `New York`, etc.).
* **Limitation of Liability & Indemnity**: Trailing fees multiplier calculations.
* **Security & Compliance Protocols**: `SOC 2 Type II`, `ISO 27001`, `AES-256`, `GDPR`.
* **Breach Notification SLAs**: Incident reporting windows with policy threshold verification.

### 4. Split-Pane Clause Inspector & Two-Way Highlighting
* **Source Text Pane (Left)**: View numbered clauses with page indicators.
* **Extracted Fields Pane (Right)**: Categorized into Commercial, Financial, Legal, and Compliance attributes.
* **Interactive Linking**: Clicking any extracted field immediately highlights and auto-scrolls to its exact source clause.
* **Inline Value Editing**: Reviewers can edit values with automatic audit log creation.

### 5. Human-in-the-Loop (HITL) Audit Desk
* Dedicated review queue for documents with confidence scores below schema floor or policy discrepancies.
* Automated mismatch detection (e.g. Vendor breach notification of 72 hours vs 24-hour corporate policy standard).
* Actions: `Approve & Verify`, `Confirm Discrepancy & Flag`, and reviewer comment drawer.

### 6. Deterministic Schema & Validation Rules Manager
* Configurable schemas for Master Services Agreements, Vendor Security Audits, and Corporate Leases.
* Add/delete schema fields (Key, Label, Data Type, Required flag, Confidence floor).
* Export live JSON Schema specifications.

### 7. Asynchronous Webhooks & ERP Connectors
* Pre-configured endpoints for **SAP S/4HANA Finance**, **Salesforce RevOps**, and **Enterprise Data Lakehouse**.
* **Live Test Dispatcher**: Dispatches real JSON payloads and displays response status code (`HTTP 200 OK`) and latency telemetry.

### 8. Immutable Compliance Audit Trail
* Cryptographically indexed chronological log recording all uploads, field edits, human approvals, and ERP syncs.
* One-click JSON export for regulatory compliance.

---

## Design Philosophy

* **100% Light Theme**: Clean white canvas (`#ffffff`), subtle borders (`#e2e8f0`), deep slate typography (`#0f172a`), and purposeful operational color coding (Emerald for verified, Rose for discrepancies, Amber for review).
* **Human-Centric Utility**: Purpose-built for compliance officers, legal counsel, and procurement teams.
* **Zero Marketing Fluff**: No buzzwords, no taglines, no promotional copy. Pure functional enterprise software.

---

## Tech Stack

* **Frontend Framework**: React 18, TypeScript, Vite
* **Styling & UI**: Tailwind CSS v4, Lucide Icons
* **Document Engines**: PDF.js (Mozilla), Mammoth.js
* **State & Storage**: React Context with LocalStorage persistence

---

## Getting Started

### Prerequisites
* Node.js v18+ (Tested on Node v22)
* npm or pnpm

### Installation & Run

```bash
# Navigate to directory
cd synapse-automation

# Install dependencies (if running standalone)
npm install

# Start development server
npm run dev
```

The application will be available at: `http://localhost:3001`

### Production Build

```bash
# Compile and bundle
npm run build

# Preview production build
npm run preview
```

---

## License

Proprietary — Developed by Amethyst Developers.
