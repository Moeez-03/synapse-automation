import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  Edit2,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Database,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExtractedField, DocumentClause } from '../../types';

export const DocumentInspector: React.FC = () => {
  const {
    selectedDocument,
    documents,
    setSelectedDocumentId,
    updateDocumentStatus,
    updateExtractedField,
    syncDocumentToDestination,
  } = useApp();

  const [highlightedClauseId, setHighlightedClauseId] = useState<string | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [reviewNote, setReviewNote] = useState<string>('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!selectedDocument) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-500">
        <FileText size={32} className="mx-auto text-slate-300 mb-2" />
        <h3 className="text-sm font-semibold text-slate-900">No Document Selected</h3>
        <p className="text-xs text-slate-500 mt-1">
          Select a document from the repository to inspect its clauses and extracted fields.
        </p>
      </div>
    );
  }

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditValue(field.value);
  };

  const handleSaveEdit = (fieldId: string) => {
    updateExtractedField(selectedDocument.id, fieldId, editValue);
    setEditingFieldId(null);
  };

  const handleFieldClick = (clauseId: string) => {
    setHighlightedClauseId(clauseId);
    const element = document.getElementById(`clause-${clauseId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const categories = ['Commercial', 'Financial', 'Legal', 'Compliance'] as const;

  return (
    <div className="space-y-4">
      {/* Top Document Header & Selector Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <FileText size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">{selectedDocument.name}</h2>
              <span className="text-[11px] font-mono text-slate-400">({selectedDocument.id})</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{selectedDocument.type}</span>
              <span>•</span>
              <span>{selectedDocument.pageCount} Pages</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold font-mono">
                {selectedDocument.confidenceScore}% Confidence Score
              </span>
            </div>
          </div>
        </div>

        {/* Document Switcher Dropdown & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedDocument.id}
            onChange={(e) => setSelectedDocumentId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-md px-2.5 py-1.5 focus:outline-none"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name.length > 32 ? d.name.slice(0, 32) + '...' : d.name} ({d.status})
              </option>
            ))}
          </select>

          {selectedDocument.status !== 'Verified' && selectedDocument.status !== 'Synced to ERP' && (
            <button
              onClick={() => updateDocumentStatus(selectedDocument.id, 'Verified', reviewNote)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md shadow-2xs transition-colors"
            >
              <CheckCircle2 size={13} />
              <span>Approve Document</span>
            </button>
          )}

          {selectedDocument.status !== 'Flagged Discrepancy' && (
            <button
              onClick={() =>
                updateDocumentStatus(
                  selectedDocument.id,
                  'Flagged Discrepancy',
                  reviewNote || 'Flagged during clause review by Legal Counsel.'
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-medium rounded-md transition-colors"
            >
              <AlertTriangle size={13} />
              <span>Flag Discrepancy</span>
            </button>
          )}

          <button
            onClick={() => syncDocumentToDestination(selectedDocument.id, 'SAP S/4HANA')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md shadow-2xs transition-colors"
          >
            <Send size={13} />
            <span>Sync to ERP</span>
          </button>
        </div>
      </div>

      {/* Split-Pane Inspector Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Pane: Original Source Text & Clause Viewer (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-[750px]">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800">Source Document Clauses</span>
              <span className="text-[11px] text-slate-500 font-mono">
                ({selectedDocument.clauses.length} parsed sections)
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Click any field on the right to jump to source
            </div>
          </div>

          <div className="p-4 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100">
            {selectedDocument.clauses.map((clause) => {
              const isHighlighted = highlightedClauseId === clause.id;
              return (
                <div
                  key={clause.id}
                  id={`clause-${clause.id}`}
                  className={`pt-3 first:pt-0 p-3.5 rounded-lg border transition-all ${
                    isHighlighted
                      ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-100'
                      : 'border-slate-200/60 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {clause.clauseNumber}
                      </span>
                      <span className="text-xs font-medium text-slate-700">{clause.title}</span>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      Page {clause.page}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-normal selection:bg-amber-100">
                    {clause.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Extracted Structured Data Fields (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-[750px]">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800">Extracted Fields</span>
              <span className="text-[11px] text-slate-500 ml-1.5">
                ({selectedDocument.extractedFields.length} validated schema attributes)
              </span>
            </div>
          </div>

          <div className="p-4 overflow-y-auto space-y-5 flex-1">
            {categories.map((category) => {
              const categoryFields = selectedDocument.extractedFields.filter(
                (f) => f.category === category
              );
              if (categoryFields.length === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                    {category} Fields
                  </div>

                  <div className="space-y-2">
                    {categoryFields.map((field) => {
                      const isEditing = editingFieldId === field.id;
                      const isSourceActive = highlightedClauseId === field.sourceClauseId;

                      return (
                        <div
                          key={field.id}
                          className={`p-3 rounded-lg border transition-all ${
                            isSourceActive
                              ? 'border-brand-500 bg-brand-50/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <button
                              onClick={() => handleFieldClick(field.sourceClauseId)}
                              className="text-left font-medium text-xs text-slate-800 hover:text-brand-600 hover:underline flex items-center gap-1"
                            >
                              <span>{field.label}</span>
                              <ChevronRight size={12} className="text-slate-400" />
                            </button>

                            <div className="flex items-center gap-1.5">
                              {field.status === 'flagged' ? (
                                <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                  Flagged
                                </span>
                              ) : field.status === 'modified' ? (
                                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                  Modified
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  {field.confidence}% Match
                                </span>
                              )}

                              {!isEditing && (
                                <button
                                  onClick={() => handleStartEdit(field)}
                                  className="text-slate-400 hover:text-slate-600 p-0.5"
                                  title="Edit Extracted Field"
                                >
                                  <Edit2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="mt-2 flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 bg-white border border-brand-500 rounded px-2 py-1 text-xs text-slate-900 focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEdit(field.id)}
                                className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                title="Save"
                              >
                                <Check size={13} />
                              </button>
                              <button
                                onClick={() => setEditingFieldId(null)}
                                className="p-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                                title="Cancel"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => handleFieldClick(field.sourceClauseId)}
                              className="font-mono text-xs text-slate-900 font-semibold bg-slate-50 p-2 rounded border border-slate-200/80 cursor-pointer"
                            >
                              {field.value}
                            </div>
                          )}

                          {field.originalValue !== field.value && (
                            <div className="text-[10px] text-slate-500 mt-1 font-mono">
                              Raw: "{field.originalValue}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Review Notes Section */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Review & Audit Notes ({selectedDocument.reviewNotes.length})
                </span>
                <button
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className="text-xs text-brand-600 hover:underline font-medium"
                >
                  {showNoteInput ? 'Cancel' : '+ Add Note'}
                </button>
              </div>

              {showNoteInput && (
                <div className="mb-3 space-y-2">
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Enter compliance or legal audit notes..."
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        if (reviewNote.trim()) {
                          updateDocumentStatus(selectedDocument.id, selectedDocument.status, reviewNote);
                          setReviewNote('');
                          setShowNoteInput(false);
                        }
                      }}
                      className="px-2.5 py-1 bg-slate-900 text-white rounded text-xs font-medium"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {selectedDocument.reviewNotes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">{note.author} ({note.role})</span>
                      <span>{note.timestamp}</span>
                    </div>
                    <p className="text-slate-700">{note.note}</p>
                  </div>
                ))}

                {selectedDocument.reviewNotes.length === 0 && (
                  <div className="text-xs text-slate-400 italic py-2">
                    No compliance notes recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
