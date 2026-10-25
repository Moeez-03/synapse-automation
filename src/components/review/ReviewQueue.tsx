import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Check,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReviewQueue: React.FC = () => {
  const { documents, updateDocumentStatus, openInspectorForDocument } = useApp();

  const [activeNoteDocId, setActiveNoteDocId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const queueItems = documents.filter(
    (d) => d.status === 'Pending Review' || d.status === 'Flagged Discrepancy'
  );

  const handleApproveWithNote = (docId: string) => {
    updateDocumentStatus(
      docId,
      'Verified',
      reviewNote || 'Approved by Legal Reviewer following clause validation.'
    );
    setActiveNoteDocId(null);
    setReviewNote('');
  };

  const handleFlagWithNote = (docId: string) => {
    updateDocumentStatus(
      docId,
      'Flagged Discrepancy',
      reviewNote || 'Discrepancy confirmed. Requires manual contract amendment.'
    );
    setActiveNoteDocId(null);
    setReviewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-900">Human-in-the-Loop Audit Desk</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Documents with confidence scores below schema threshold or flagged policy rule mismatches
            require explicit human signoff before synchronization to enterprise ERP systems.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            <span className="text-slate-400 block text-[10px]">IN QUEUE</span>
            <span className="text-amber-700 font-bold text-sm">{queueItems.length} Pending</span>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            <span className="text-slate-400 block text-[10px]">AVG SLA</span>
            <span className="text-slate-700 font-bold text-sm">2.4 Hours</span>
          </div>
        </div>
      </div>

      {/* Queue Items */}
      <div className="space-y-4">
        {queueItems.map((doc) => {
          const isFlagged = doc.status === 'Flagged Discrepancy';
          const flaggedFields = doc.extractedFields.filter((f) => f.status === 'flagged');

          return (
            <div
              key={doc.id}
              className={`bg-white rounded-lg border shadow-sm p-5 transition-all ${
                isFlagged ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isFlagged
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isFlagged ? <AlertTriangle size={18} /> : <Clock size={18} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                      <span className="text-xs font-mono text-slate-400">({doc.id})</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isFlagged
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {doc.type} • Uploaded {doc.uploadDate} • {doc.pageCount} Pages • Overall Confidence:{' '}
                      <strong className="text-slate-700">{doc.confidenceScore}%</strong>
                    </div>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openInspectorForDocument(doc.id)}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors"
                  >
                    Inspect Clauses
                  </button>

                  <button
                    onClick={() => setActiveNoteDocId(activeNoteDocId === doc.id ? null : doc.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-md transition-colors"
                  >
                    {activeNoteDocId === doc.id ? 'Close Audit Drawer' : 'Add Decision Note'}
                  </button>

                  <button
                    onClick={() => handleApproveWithNote(doc.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Approve & Verify</span>
                  </button>
                </div>
              </div>

              {/* Review Drawer when open */}
              {activeNoteDocId === doc.id && (
                <div className="my-4 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
                  <label className="block text-xs font-semibold text-slate-800">
                    Compliance Officer Audit Comment:
                  </label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Document regulatory justification, policy waiver details, or contract amendment requests..."
                    rows={3}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleFlagWithNote(doc.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded"
                    >
                      Confirm Discrepancy & Flag
                    </button>
                    <button
                      onClick={() => handleApproveWithNote(doc.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded"
                    >
                      Authorize & Approve
                    </button>
                  </div>
                </div>
              )}

              {/* Flagged Field Details */}
              {flaggedFields.length > 0 && (
                <div className="mt-4 p-3.5 rounded-lg bg-rose-50/60 border border-rose-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900 mb-2">
                    <ShieldAlert size={15} className="text-rose-600" />
                    <span>Compliance Policy Mismatch Detected:</span>
                  </div>
                  <div className="space-y-2">
                    {flaggedFields.map((field) => (
                      <div
                        key={field.id}
                        className="bg-white p-2.5 rounded border border-rose-200/80 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-semibold text-slate-900">{field.label}:</span>{' '}
                          <span className="font-mono text-rose-700 font-semibold">{field.value}</span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            Original Document Citation: "{field.originalValue}"
                          </span>
                        </div>
                        <div className="text-[11px] font-mono font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200 shrink-0">
                          Confidence: {field.confidence}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary of Extracted Data */}
              <div className="mt-4">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Key Attributes Ready for Review ({doc.extractedFields.length} total)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {doc.extractedFields.map((field) => (
                    <div
                      key={field.id}
                      className="p-2 rounded bg-slate-50 border border-slate-200/70 text-xs"
                    >
                      <span className="text-[10px] text-slate-500 block truncate">{field.label}</span>
                      <span className="font-semibold text-slate-800 font-mono truncate block mt-0.5">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {queueItems.length === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-500">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-900">Review Queue Clear</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All documents have been verified and processed according to enterprise compliance standards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
