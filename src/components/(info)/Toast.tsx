"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  FC,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

type Severity = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: number;
  message: string;
  severity: Severity;
}

interface ToastContextType {
  addToast: (message: string, severity: Severity) => void;
}

interface ToastProps extends ToastMessage {
  onDismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  const { addToast } = context;
  const success = useCallback(
    (message: string) => addToast(message, "success"),
    [addToast],
  );
  const error = useCallback(
    (message: string) => addToast(message, "error"),
    [addToast],
  );
  const warning = useCallback(
    (message: string) => addToast(message, "warning"),
    [addToast],
  );
  const info = useCallback(
    (message: string) => addToast(message, "info"),
    [addToast],
  );
  return useMemo(
    () => ({ success, error, warning, info }),
    [success, error, warning, info],
  );
};

const ToastIcon: FC<{ severity: Severity }> = ({ severity }) => {
  const iconPaths: Record<Severity, ReactNode> = {
    success: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    error: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    ),
    warning: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    ),
    info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    ),
  };

  const severityClasses: Record<Severity, string> = {
    success: "text-teal-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`h-6 w-6 ${severityClasses[severity]}`}
    >
      {iconPaths[severity]}
    </svg>
  );
};

const Toast: FC<ToastProps> = ({ id, message, severity, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(id), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300);
  };

  const severityClasses: Record<Severity, string> = {
    success: "border-l-teal-500",
    error: "border-l-red-500",
    warning: "border-l-yellow-500",
    info: "border-l-blue-500",
  };

  return (
    <div
      className={`relative mb-4 flex w-full max-w-sm items-center overflow-hidden rounded-lg border-l-4 bg-white p-4 shadow-lg transition-all duration-300 ease-in-out ${severityClasses[severity]} ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
    >
      <ToastIcon severity={severity} />
      <p className="ml-3 flex-grow text-sm font-medium text-gray-700">
        {message}
      </p>
      <button
        onClick={handleDismiss}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

const ToastContainer: FC<{
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, severity: Severity) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, severity }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};
