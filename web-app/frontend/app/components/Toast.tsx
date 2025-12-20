/**
 * Toast通知组件 - 替代alert提供更好的用户体验
 * 使用纯CSS实现，无需额外依赖
 */

import { useState, useEffect } from 'react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-lg border shadow-lg ${colors[type]} max-w-md`}>
        <span className="text-2xl">{icons[type]}</span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="text-gray-500 hover:text-gray-700 text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Toast管理器Hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: number }>>([]);
  const [nextId, setNextId] = useState(0);

  const show = (props: Omit<ToastProps, 'onClose'>) => {
    const id = nextId;
    setNextId(id + 1);
    setToasts(prev => [...prev, { ...props, id, onClose: () => remove(id) }]);
  };

  const remove = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    success: (message: string, duration?: number) => show({ message, type: 'success', duration }),
    error: (message: string, duration?: number) => show({ message, type: 'error', duration }),
    warning: (message: string, duration?: number) => show({ message, type: 'warning', duration }),
    info: (message: string, duration?: number) => show({ message, type: 'info', duration }),
  };
}

// Toast容器组件
export function ToastContainer({ toasts }: { toasts: Array<ToastProps & { id: number }> }) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${4 + index * 5}rem` }} className="absolute">
          <Toast {...toast} />
        </div>
      ))}
    </>
  );
}
