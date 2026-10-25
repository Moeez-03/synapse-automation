export type DocumentType =
  | 'Master Services Agreement'
  | 'Vendor Security Audit'
  | 'Corporate Lease Agreement'
  | 'Non-Disclosure Agreement'
  | 'Executive Employment Contract'
  | 'Enterprise Software License';

export type DocumentStatus =
  | 'Pending Review'
  | 'Verified'
  | 'Flagged Discrepancy'
  | 'Synced to ERP';

export interface DocumentClause {
  id: string;
  clauseNumber: string;
  title: string;
  content: string;
  page: number;
}

export interface ExtractedField {
  id: string;
  key: string;
  label: string;
  value: string;
  originalValue: string;
  confidence: number;
  sourceClauseId: string;
  status: 'verified' | 'modified' | 'flagged';
  category: 'Commercial' | 'Legal' | 'Compliance' | 'Financial';
}

export interface ReviewNote {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  note: string;
  action: 'approved' | 'rejected' | 'flagged' | 'comment';
}

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  uploadDate: string;
  fileSize: string;
  pageCount: number;
  confidenceScore: number;
  summary: string;
  clauses: DocumentClause[];
  extractedFields: ExtractedField[];
  reviewNotes: ReviewNote[];
  syncDestination?: string;
  syncedAt?: string;
}

export interface SchemaField {
  id: string;
  key: string;
  label: string;
  dataType: 'text' | 'currency' | 'date' | 'boolean' | 'number';
  required: boolean;
  threshold: number;
  description: string;
}

export interface SchemaDefinition {
  id: string;
  name: string;
  documentType: DocumentType;
  fields: SchemaField[];
  updatedAt: string;
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  destination: string;
  url: string;
  status: 'active' | 'failing' | 'paused';
  events: string[];
  lastDispatched: string;
  successRate: number;
  latencyMs: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  type: 'system' | 'user' | 'sync' | 'security';
  details: string;
}
