import React from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Send,
  MoreVertical,
  Layers,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentItem, DocumentStatus } from '../../types';

export const DocumentList: React.FC = () => {
  const {
    documents,
    openInspectorForDocument,
    updateDocumentStatus,
    syncDocumentToDestination,
    searchTerm,
    statusFilter,
  } = useApp();

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.extractedFields.some(
        (f) =>
          f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.value.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDocs = documents.length;
  const verifiedDocs = documents.filter((d) => d.status === 'Verified' || d.status === 'Synced to ERP').length;
  const flaggedDocs = documents.filter((d) => d.status === 'Flagged Discrepancy').length;
  const pendingDocs = documents.filter((d) => d.status === 'Pending Review').length;

  const renderStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} />
            Verified
          </span>
        );
      case 'Flagged Discrepancy':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle size={11} />
            Discrepancy
          </span>
        );
      case 'Synced to ERP':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Database size={11} />
            Synced
          </span>
        );
      case 'Pending Review':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={11} />
            Needs Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Ingested
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalDocs}</span>
            <span className="text-xs text-slate-500 font-mono">100% Parsed</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Across 6 commercial categories</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Verified Accuracy
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">99.4%</span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
              Passing SLA
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Zero false negative threshold</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Review Queue
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{pendingDocs + flaggedDocs}</span>
            <span className="text-xs text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
              Action Required
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {flaggedDocs} flagged compliance mismatch
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Synced to ERP
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-600">{verifiedDocs}</span>
            <span className="text-xs text-slate-500 font-mono">SAP & Salesforce</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Sub-50ms webhook latency</div>
        </div>
      </div>

      {/* Main Document Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Document Repository</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredDocs.length} of {documents.length} ingested contract and audit filings
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-5">Document</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Pages / Size</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Name & ID */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                        <FileText size={15} />
                      </div>
                      <div>
                        <button
                          onClick={() => openInspectorForDocument(doc.id)}
                          className="font-medium text-slate-900 hover:text-brand-600 hover:underline text-left block"
                        >
                          {doc.name}
                        </button>
                        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                          {doc.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-slate-800 font-medium">{doc.type}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">{renderStatusBadge(doc.status)}</td>

                  {/* Confidence */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full ${
                            doc.confidenceScore >= 95
                              ? 'bg-emerald-500'
                              : doc.confidenceScore >= 85
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${doc.confidenceScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-medium text-slate-700">
                        {doc.confidenceScore}%
                      </span>
                    </div>
                  </td>

                  {/* Pages & Size */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {doc.pageCount} pgs • {doc.fileSize}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                    {doc.uploadDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openInspectorForDocument(doc.id)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-medium transition-colors shadow-2xs"
                      >
                        Inspect
                      </button>

                      {doc.status !== 'Synced to ERP' && doc.status !== 'Flagged Discrepancy' && (
                        <button
                          onClick={() => syncDocumentToDestination(doc.id, 'SAP S/4HANA')}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs"
                          title="Sync to SAP S/4HANA"
                        >
                          <Send size={11} />
                          <span>Sync</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <FileText size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-medium">No documents matched your filters.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Try clearing your search query or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
