import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/40',
    error: 'border-rose-200 bg-rose-50/40',
    info: 'border-indigo-200 bg-indigo-50/40',
    warning: 'border-amber-200 bg-amber-50/40'
  };

  return (
    <div className={`pointer-events-auto bg-white border ${borders[toast.type] || borders.info} rounded-xl p-4 shadow-lg flex items-start gap-3 animate-slide-in`}>
      {icons[toast.type] || icons.info}
      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-bold text-slate-900 leading-snug">{toast.title}</h5>
        {toast.message && (
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button 
        onClick={onRemove}
        className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-all cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
