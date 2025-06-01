import clsx from 'clsx';
import { LoadingSpinner } from './LoadingSpinner';


const variants = {
  primary: 'bg-primary text-primary-contrast hover:bg-primary-hover',
  warning: 'bg-warning text-white hover:bg-warning/90',
  danger: 'bg-danger text-white hover:bg-danger/80',
  secondary: 'bg-neutral-bg text-neutral-text-secondary hover:text-neutral-text'
};

const sizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  loading = false,
  ...props 
}) => {
  return (
    <button
      className={clsx(
        'rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner />
          Loading...
        </span>
      ) : children}
    </button>
  );
}; 