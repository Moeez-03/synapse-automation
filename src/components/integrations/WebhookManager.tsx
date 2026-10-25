import React, { useState } from 'react';
import {
  Webhook,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Database,
  RefreshCw,
  Code,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WebhookEndpoint } from '../../types';

export const WebhookManager: React.FC = () => {
  const { webhooks, testWebhookDispatch } = useApp();

  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    id: string;
    success: boolean;
    latency: number;
    payload: any;
  } | null>(null);

  const handleTest = async (wh: WebhookEndpoint) => {
    setTestingId(wh.id);
    const result = await testWebhookDispatch(wh.id);
    setTestResult({
      id: wh.id,
      ...result,
    });
    setTestingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Webhook size={16} className="text-slate-900" />
            <h2 className="text-sm font-bold text-slate-900">Enterprise Integrations & Webhooks</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Configure automated Celery workers and asynchronous webhook dispatchers connecting
            verified document data directly into SAP S/4HANA, Salesforce, and enterprise data warehouses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium">
            3 Connectors Online
          </span>
        </div>
      </div>

      {/* Webhook Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {webhooks.map((wh) => {
          const isTestingThis = testingId === wh.id;

          return (
            <div
              key={wh.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200">
                      <Database size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">{wh.name}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">{wh.destination}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="mt-3 bg-slate-50 p-2 rounded border border-slate-200/80 font-mono text-[11px] text-slate-700 break-all select-all">
                  {wh.url}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Success Rate</span>
                    <span className="font-mono font-medium text-slate-900">{wh.successRate}%</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Avg Response Latency</span>
                    <span className="font-mono font-medium text-slate-900">{wh.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Subscribed Events</span>
                    <span className="text-slate-700 font-medium">{wh.events.join(', ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Last Dispatched</span>
                    <span className="font-mono text-slate-600">{wh.lastDispatched}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleTest(wh)}
                  disabled={isTestingThis}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium transition-colors"
                >
                  <Send size={12} className={isTestingThis ? 'animate-spin' : ''} />
                  <span>{isTestingThis ? 'Transmitting...' : 'Dispatch Test Payload'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Test Result Inspector Modal/Box */}
      {testResult && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">
                Webhook Dispatch Successful (HTTP 200 OK)
              </h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {testResult.latency} ms roundtrip
              </span>
              <button
                onClick={() => setTestResult(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-sans"
              >
                Dismiss
              </button>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Transmitted JSON Payload:
            </span>
            <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-52">
              {JSON.stringify(testResult.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
