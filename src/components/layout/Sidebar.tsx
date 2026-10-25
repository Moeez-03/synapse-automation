import React from 'react';
import {
  FileText,
  CheckSquare,
  Split,
  Settings2,
  Webhook,
  History,
  ShieldCheck,
  Server,
  FolderGit2,
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, documents } = useApp();

  const pendingReviewCount = documents.filter(
    (d) => d.status === 'Pending Review' || d.status === 'Flagged Discrepancy'
  ).length;

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'documents', label: 'All Documents', icon: FileText, badge: documents.length },
    { id: 'inspector', label: 'Clause Inspector', icon: Split },
    { id: 'review', label: 'Review Queue', icon: CheckSquare, badge: pendingReviewCount },
    { id: 'schemas', label: 'Extraction Schemas', icon: Settings2 },
    { id: 'webhooks', label: 'Webhooks & ERP', icon: Webhook },
    { id: 'audit', label: 'Audit Trail', icon: History },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <FolderGit2 size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-sm tracking-tight">Synapse</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Ops
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">Document Operations Engine</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className={isActive ? 'text-slate-900' : 'text-slate-400'}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      item.id === 'review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Infrastructure Telemetry Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70">
        <div className="p-2.5 rounded-lg border border-slate-200/80 bg-white space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Server size={12} className="text-slate-400" />
              Cluster
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live (18ms)
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-slate-400" />
              Compliance
            </span>
            <span className="text-slate-700 font-medium">SOC 2 Verified</span>
          </div>
        </div>

        <div className="mt-2.5 px-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>v2.4.1 (Internal)</span>
          <span className="font-mono">Node: us-east-1</span>
        </div>
      </div>
    </aside>
  );
};
