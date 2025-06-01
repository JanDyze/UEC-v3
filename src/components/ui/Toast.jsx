import { useEffect } from 'react';
import { Text } from './Text';
import clsx from 'clsx';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={clsx(
        'fixed bottom-4 right-4 z-50',
        'flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg',
        'transform transition-all duration-300 ease-in-out',
        'animate-slide-up',
        type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'
      )}
    >
      <Text className="font-medium">{message}</Text>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}; 