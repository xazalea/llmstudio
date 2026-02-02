"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { cn } from "@/lib/utils";
import { XIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon, AlertTriangleIcon } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const duration = toast.duration ?? 5000;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
    error: <AlertCircleIcon className="h-5 w-5 text-red-400" />,
    warning: <AlertTriangleIcon className="h-5 w-5 text-yellow-400" />,
    info: <InfoIcon className="h-5 w-5 text-blue-400" />,
  };

  const borderColors: Record<ToastType, string> = {
    success: "border-green-500/20",
    error: "border-red-500/20",
    warning: "border-yellow-500/20",
    info: "border-blue-500/20",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border bg-[#0a0a0a]/95 backdrop-blur-xl p-4 shadow-lg animate-slide-up min-w-[300px] max-w-[400px]",
        borderColors[toast.type]
      )}
    >
      {icons[toast.type]}
      <div className="flex-1">
        <p className="font-medium text-sm">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-white transition-colors"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

// Convenience hooks for different toast types
export function useSuccessToast() {
  const { addToast } = useToast();
  return useCallback(
    (title: string, description?: string) =>
      addToast({ type: "success", title, description }),
    [addToast]
  );
}

export function useErrorToast() {
  const { addToast } = useToast();
  return useCallback(
    (title: string, description?: string) =>
      addToast({ type: "error", title, description }),
    [addToast]
  );
}

export function useWarningToast() {
  const { addToast } = useToast();
  return useCallback(
    (title: string, description?: string) =>
      addToast({ type: "warning", title, description }),
    [addToast]
  );
}

export function useInfoToast() {
  const { addToast } = useToast();
  return useCallback(
    (title: string, description?: string) =>
      addToast({ type: "info", title, description }),
    [addToast]
  );
}
