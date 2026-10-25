import React, { useState } from 'react';
import { History, Download, Filter, ShieldCheck, User, Server, Database } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuditTrail: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(
    (log) => filterType === 'ALL' || log.type === filterType
  );

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `synapse_audit_trail_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User size={13} className="text-blue-600" />;
      case 'security':
        return <ShieldCheck size={13} className="text-rose-600" />;
      case 'sync':
        return <Database size={13} className="text-purple-600" />;
      case 'system':
      default:
        return <Server size={13} className="text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History size={16} className="text-slate-800" />
            <h2 className="text-sm font-bold text-slate-900">Immutable Compliance Audit Trail</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Cryptographically indexed event log tracking all document uploads, schema field modifications,
            human reviewer approvals, and outbound ERP transmissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-md px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            <option value="user">Human Review Actions</option>
            <option value="security">Policy & Discrepancies</option>
            <option value="sync">ERP & Webhook Syncs</option>
            <option value="system">System Parsing</option>
          </select>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md shadow-2xs transition-colors"
          >
            <Download size={13} />
            <span>Export Log (JSON)</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Actor</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Target Document</th>
                <th className="py-2.5 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      {renderTypeIcon(log.type)}
                      <span>{log.user}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
                        log.type === 'security'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : log.type === 'sync'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : log.type === 'user'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 max-w-xs truncate">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
