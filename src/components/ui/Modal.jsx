import { Text } from './Text';
import { Button } from './Button';
import clsx from 'clsx';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  className 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-text/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={clsx(
        "bg-neutral-white rounded-xl shadow-card w-full max-w-lg mx-4 overflow-hidden",
        className
      )}>
        <div className="flex justify-between items-center p-4 border-b border-neutral-border">
          <Text variant="h3">{title}</Text>
          <button
            onClick={onClose}
            className="text-neutral-text-secondary hover:text-neutral-text"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-2 p-4 border-t border-neutral-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}; 