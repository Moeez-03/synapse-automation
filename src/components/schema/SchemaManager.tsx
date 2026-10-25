import React, { useState } from 'react';
import {
  Settings2,
  Plus,
  Trash2,
  Code,
  CheckCircle2,
  Sliders,
  FileCode,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SchemaField, SchemaDefinition } from '../../types';

export const SchemaManager: React.FC = () => {
  const { schemas, addSchemaField, deleteSchemaField } = useApp();

  const [selectedSchemaId, setSelectedSchemaId] = useState<string>(schemas[0]?.id || 'sch-1');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  // New Field State
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<'text' | 'currency' | 'date' | 'boolean' | 'number'>('text');
  const [newRequired, setNewRequired] = useState(true);
  const [newThreshold, setNewThreshold] = useState(90);
  const [newDesc, setNewDesc] = useState('');

  const activeSchema = schemas.find((s) => s.id === selectedSchemaId) || schemas[0];

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newLabel) return;

    addSchemaField(activeSchema.id, {
      key: newKey.trim().toLowerCase().replace(/\s+/g, '_'),
      label: newLabel.trim(),
      dataType: newType,
      required: newRequired,
      threshold: Number(newThreshold),
      description: newDesc.trim() || 'Custom validation attribute',
    });

    setNewKey('');
    setNewLabel('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 size={16} className="text-slate-800" />
            <h2 className="text-sm font-bold text-slate-900">Deterministic Extraction Schemas</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Configure Pydantic extraction rules, validation thresholds, and required fields across
            contract classes to eliminate model reasoning drift.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJsonPreview(!showJsonPreview)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors"
          >
            <Code size={13} />
            <span>{showJsonPreview ? 'Hide JSON Spec' : 'Export JSON Spec'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md shadow-2xs transition-colors"
          >
            <Plus size={13} />
            <span>Add Schema Field</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Schemas Selector & Fields Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Schema Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Active Document Schemas ({schemas.length})
          </div>

          <div className="space-y-2">
            {schemas.map((sch) => {
              const isSelected = sch.id === activeSchema.id;
              return (
                <div
                  key={sch.id}
                  onClick={() => setSelectedSchemaId(sch.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-brand-500 ring-2 ring-brand-100 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-slate-900">{sch.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {sch.fields.length} fields
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">{sch.documentType}</div>
                  <div className="mt-2 text-[10px] text-slate-400 font-mono">
                    Last Updated: {sch.updatedAt}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Field List for Active Schema (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
            <div>
              <h3 className="text-xs font-bold text-slate-900">{activeSchema.name}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Target Classification: {activeSchema.documentType}
              </p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-medium">
              Deterministic Schema Enforced
            </span>
          </div>

          {showJsonPreview && (
            <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs border-b border-slate-200 overflow-x-auto max-h-64">
              <pre>{JSON.stringify(activeSchema, null, 2)}</pre>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-4">Field Name / Key</th>
                  <th className="py-2.5 px-4">Data Type</th>
                  <th className="py-2.5 px-4">Requirement</th>
                  <th className="py-2.5 px-4">Confidence Floor</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {activeSchema.fields.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{field.label}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {field.key}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                        {field.dataType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {field.required ? (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          Required
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {field.threshold}%
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {field.description}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteSchemaField(activeSchema.id, field.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete Field"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Schema Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Add Schema Field</h3>
            <p className="text-xs text-slate-500 mb-4">
              Define a new structured extraction target for {activeSchema.name}
            </p>

            <form onSubmit={handleCreateField} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Field Label</label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => {
                    setNewLabel(e.target.value);
                    if (!newKey) {
                      setNewKey(e.target.value.toLowerCase().replace(/\s+/g, '_'));
                    }
                  }}
                  placeholder="e.g. Indemnification Multiplier"
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Canonical Key (Pydantic attribute)
                </label>
                <input
                  type="text"
                  required
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. indemnification_multiplier"
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Data Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-900"
                  >
                    <option value="text">String / Text</option>
                    <option value="currency">Currency / Financial</option>
                    <option value="date">Date (ISO 8601)</option>
                    <option value="number">Numeric</option>
                    <option value="boolean">Boolean Flag</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Confidence Floor (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief description of clause target"
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reqCheck"
                  checked={newRequired}
                  onChange={(e) => setNewRequired(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-0"
                />
                <label htmlFor="reqCheck" className="text-xs text-slate-700 select-none">
                  Require field (flags document if missing from text)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium"
                >
                  Save Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
