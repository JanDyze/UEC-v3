import clsx from 'clsx';

export const Text = ({ 
  children, 
  variant = 'body',
  color = 'default',
  className,
  ...props 
}) => {
  const variants = {
    h1: 'text-4xl font-bold',
    h2: 'text-2xl font-medium',
    h3: 'text-xl font-medium',
    body: 'text-base',
    small: 'text-sm'
  };

  const colors = {
    default: 'text-neutral-text',
    secondary: 'text-neutral-text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger'
  };

  return (
    <div
      className={clsx(
        variants[variant],
        colors[color],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 