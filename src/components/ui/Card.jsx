import clsx from 'clsx';

const variants = {
  white: 'bg-neutral-white',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  danger: 'bg-danger/10'
};

export const Card = ({ 
  children, 
  variant = 'white', 
  className,
  ...props 
}) => {
  return (
    <div 
      className={clsx(
        'rounded-xl shadow-card p-4',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 