import React from 'react';
import { Search, Plus, Filter, Bell, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopHeader: React.FC<{ onOpenUpload: () => void }> = ({ onOpenUpload }) => {
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter } = useApp();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents, extracted fields, or clauses..."
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md p-1 text-xs">
          <Filter size={13} className="text-slate-400 ml-1.5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-slate-700 text-xs font-medium focus:outline-none pr-2 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Flagged Discrepancy">Flagged Discrepancy</option>
            <option value="Synced to ERP">Synced to ERP</option>
          </select>
        </div>

        {/* Upload Action Button */}
        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md shadow-sm transition-colors"
        >
          <Plus size={14} />
          <span>Ingest Document</span>
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* User Identity */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 text-xs font-semibold">
            SJ
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-slate-900 leading-none">Sarah Jenkins</div>
            <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">Legal Counsel</div>
          </div>
        </div>
      </div>
    </header>
  );
};
