import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { DocumentList } from './components/documents/DocumentList';
import { DocumentInspector } from './components/documents/DocumentInspector';
import { DocumentUploadModal } from './components/documents/DocumentUploadModal';
import { ReviewQueue } from './components/review/ReviewQueue';
import { SchemaManager } from './components/schema/SchemaManager';
import { WebhookManager } from './components/integrations/WebhookManager';
import { AuditTrail } from './components/audit/AuditTrail';
import { useApp } from './context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, toastMessage } = useApp();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'documents' && <DocumentList />}
          {activeTab === 'inspector' && <DocumentInspector />}
          {activeTab === 'review' && <ReviewQueue />}
          {activeTab === 'schemas' && <SchemaManager />}
          {activeTab === 'webhooks' && <WebhookManager />}
          {activeTab === 'audit' && <AuditTrail />}
        </main>
      </div>
    </div>
  );
};
