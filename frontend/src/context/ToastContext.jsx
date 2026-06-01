import React, { createContext, useState, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur),
    info: (msg, dur) => showToast(msg, 'info', dur),
    warning: (msg, dur) => showToast(msg, 'warning', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Render Area */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const { message, type } = toast;

  const styles = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-400',
      icon: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-800 dark:text-blue-400',
      icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    },
  }[type] || styles.success;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl ${styles.bg} glass-card animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto`}>
      {styles.icon}
      <div className="flex-1 text-sm font-medium leading-relaxed">{message}</div>
      <button
        onClick={onClose}
        className="p-0.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
