"use client";

import { create } from "zustand";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearAll: () => set({ toasts: [] }),
}));

// Toast hook for easy usage
export const useToast = () => {
  const { addToast } = useToastStore();

  const toast = {
    success: (message: string, title?: string) =>
      addToast({ type: "success", message, title }),
    error: (message: string, title?: string) =>
      addToast({ type: "error", message, title }),
    info: (message: string, title?: string) =>
      addToast({ type: "info", message, title }),
    warning: (message: string, title?: string) =>
      addToast({ type: "warning", message, title }),
  };

  return { toast };
};

// Individual Toast Component
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const config = {
    success: {
      icon: CheckCircle,
      className: "bg-green-50 border-green-200 text-green-800",
      iconClassName: "text-green-600",
    },
    error: {
      icon: AlertCircle,
      className: "bg-red-50 border-red-200 text-red-800",
      iconClassName: "text-red-600",
    },
    warning: {
      icon: AlertCircle,
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconClassName: "text-yellow-600",
    },
    info: {
      icon: Info,
      className: "bg-blue-50 border-blue-200 text-blue-800",
      iconClassName: "text-blue-600",
    },
  };

  const { icon: Icon, className, iconClassName } = config[toast.type];

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={cn(
        "relative flex items-start space-x-3 p-4 rounded-lg border shadow-lg max-w-sm animate-in slide-in-from-right duration-300",
        className,
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", iconClassName)} />

      <div className="flex-1 min-w-0">
        {toast.title && <p className="font-medium text-sm">{toast.title}</p>}
        <p className={cn("text-sm", toast.title ? "mt-1" : "")}>
          {toast.message}
        </p>
      </div>

      {toast.dismissible && (
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 ml-4 p-1 rounded-md hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Toast Container Component
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
