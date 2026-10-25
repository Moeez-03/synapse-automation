import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DocumentItem,
  DocumentStatus,
  SchemaDefinition,
  WebhookEndpoint,
  AuditLogEntry,
} from '../types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_SCHEMAS,
  INITIAL_WEBHOOKS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

export type NavTab = 'documents' | 'inspector' | 'review' | 'schemas' | 'webhooks' | 'audit';

interface AppContextType {
  // Navigation
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Documents
  documents: DocumentItem[];
  selectedDocumentId: string;
  selectedDocument: DocumentItem | undefined;
  setSelectedDocumentId: (id: string) => void;
  openInspectorForDocument: (id: string) => void;
  addDocument: (doc: DocumentItem) => void;
  updateDocumentStatus: (id: string, status: DocumentStatus, note?: string) => void;
  updateExtractedField: (docId: string, fieldId: string, newValue: string) => void;
  syncDocumentToDestination: (docId: string, destination: string) => Promise<boolean>;

  // Schemas
  schemas: SchemaDefinition[];
  addSchemaField: (schemaId: string, field: any) => void;
  deleteSchemaField: (schemaId: string, fieldId: string) => void;

  // Webhooks
  webhooks: WebhookEndpoint[];
  testWebhookDispatch: (webhookId: string) => Promise<{ success: boolean; latency: number; payload: any }>;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  // Global Search / Filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('documents');
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('synapse_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>(
    documents[0]?.id || 'DOC-2026-0814'
  );
  const [schemas, setSchemas] = useState<SchemaDefinition[]>(() => {
    const saved = localStorage.getItem('synapse_schemas');
    return saved ? JSON.parse(saved) : INITIAL_SCHEMAS;
  });
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(INITIAL_WEBHOOKS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('synapse_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('synapse_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('synapse_schemas', JSON.stringify(schemas));
  }, [schemas]);

  useEffect(() => {
    localStorage.setItem('synapse_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...entry,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const selectedDocument = documents.find((d) => d.id === selectedDocumentId);

  const openInspectorForDocument = (id: string) => {
    setSelectedDocumentId(id);
    setActiveTab('inspector');
  };

  const addDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocumentId(newDoc.id);
    addAuditLog({
      user: 'Compliance Officer',
      action: 'Document Uploaded',
      target: newDoc.name,
      type: 'user',
      details: `Uploaded ${newDoc.pageCount} pages. Ingested ${newDoc.extractedFields.length} extracted fields.`,
    });
    showToast(`Document "${newDoc.name}" uploaded and parsed successfully.`);
  };

  const updateDocumentStatus = (id: string, status: DocumentStatus, note?: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          const updatedNotes = [...doc.reviewNotes];
          if (note) {
            updatedNotes.push({
              id: `rn-${Date.now()}`,
              author: 'Reviewer Desk',
              role: 'Compliance Analyst',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              note,
              action: status === 'Verified' ? 'approved' : status === 'Flagged Discrepancy' ? 'flagged' : 'rejected',
            });
          }
          return {
            ...doc,
            status,
            reviewNotes: updatedNotes,
          };
        }
        return doc;
      })
    );

    addAuditLog({
      user: 'Reviewer Desk',
      action: `Status Changed to ${status}`,
      target: id,
      type: 'user',
      details: note || `Document status updated to ${status}.`,
    });
    showToast(`Document ${id} marked as ${status}.`);
  };

  const updateExtractedField = (docId: string, fieldId: string, newValue: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            extractedFields: doc.extractedFields.map((f) => {
              if (f.id === fieldId) {
                return {
                  ...f,
                  value: newValue,
                  status: 'modified',
                };
              }
              return f;
            }),
          };
        }
        return doc;
      })
    );

    addAuditLog({
      user: 'Reviewer Desk',
      action: 'Field Value Modified',
      target: docId,
      type: 'user',
      details: `Field ID ${fieldId} modified to "${newValue}".`,
    });
    showToast('Field value updated successfully.');
  };

  const syncDocumentToDestination = async (docId: string, destination: string): Promise<boolean> => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return false;

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 650));

    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            status: 'Synced to ERP',
            syncDestination: destination,
            syncedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
        }
        return d;
      })
    );

    addAuditLog({
      user: 'Integration Worker',
      action: `Synced to ${destination}`,
      target: doc.name,
      type: 'sync',
      details: `Payload with ${doc.extractedFields.length} structured fields transferred (HTTP 200 OK).`,
    });
    showToast(`Document successfully synchronized to ${destination}.`);
    return true;
  };

  const addSchemaField = (schemaId: string, field: any) => {
    setSchemas((prev) =>
      prev.map((sch) => {
        if (sch.id === schemaId) {
          return {
            ...sch,
            fields: [...sch.fields, { ...field, id: `sf-${Date.now()}` }],
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return sch;
      })
    );
    addAuditLog({
      user: 'Schema Admin',
      action: 'Schema Field Added',
      target: schemaId,
      type: 'system',
      details: `Added new field "${field.label}" to schema.`,
    });
    showToast(`Field "${field.label}" added to schema.`);
  };

  const deleteSchemaField = (schemaId: string, fieldId: string) => {
    setSchemas((prev) =>
      prev.map((sch) => {
        if (sch.id === schemaId) {
          return {
            ...sch,
            fields: sch.fields.filter((f) => f.id !== fieldId),
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return sch;
      })
    );
    showToast('Schema field deleted.');
  };

  const testWebhookDispatch = async (webhookId: string) => {
    const wh = webhooks.find((w) => w.id === webhookId);
    await new Promise((r) => setTimeout(r, 450));
    const latency = Math.floor(Math.random() * 25) + 20;

    const testPayload = {
      event: 'document.verified',
      timestamp: new Date().toISOString(),
      document_id: 'DOC-2026-0814',
      document_type: 'Master Services Agreement',
      contract_ceiling: '$1,450,000 USD',
      governing_law: 'Delaware',
      status: 'VERIFIED',
    };

    setWebhooks((prev) =>
      prev.map((w) => {
        if (w.id === webhookId) {
          return {
            ...w,
            lastDispatched: new Date().toISOString().replace('T', ' ').substring(0, 19),
            latencyMs: latency,
          };
        }
        return w;
      })
    );

    addAuditLog({
      user: 'Webhook Tester',
      action: 'Test Dispatch Sent',
      target: wh?.name || webhookId,
      type: 'sync',
      details: `HTTP 200 OK (${latency}ms) to ${wh?.url}`,
    });

    return {
      success: true,
      latency,
      payload: testPayload,
    };
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        documents,
        selectedDocumentId,
        selectedDocument,
        setSelectedDocumentId,
        openInspectorForDocument,
        addDocument,
        updateDocumentStatus,
        updateExtractedField,
        syncDocumentToDestination,
        schemas,
        addSchemaField,
        deleteSchemaField,
        webhooks,
        testWebhookDispatch,
        auditLogs,
        addAuditLog,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
