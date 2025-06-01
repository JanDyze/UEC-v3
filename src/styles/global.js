export const styles = {
  layout: {
    container: 'container mx-auto p-4',
    section: 'mb-6',
    grid: 'grid gap-4',
    flex: 'flex items-center',
    flexBetween: 'flex justify-between items-center',
    flexCenter: 'flex items-center justify-center',
    page: 'min-h-screen bg-neutral-bg',
  },
  input: {
    base: 'w-full p-2 border border-neutral-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all',
    error: 'w-full p-2 border border-danger rounded-lg focus:border-danger focus:ring-1 focus:ring-danger/20 transition-all',
    disabled: 'bg-neutral-bg opacity-50 cursor-not-allowed',
    label: 'block text-sm text-neutral-text-secondary mb-1',
    group: 'space-y-1',
    errorText: 'text-sm text-danger mt-1',
  },
  table: {
    wrapper: 'bg-neutral-white rounded-xl shadow-card overflow-hidden',
    header: 'border-b border-neutral-border',
    row: 'border-b border-neutral-border last:border-none hover:bg-neutral-bg transition-colors',
    cell: 'p-4',
    headerCell: 'text-left p-4 text-neutral-text-secondary font-medium'
  },
  card: {
    base: 'bg-neutral-white rounded-xl shadow-card p-4',
    hover: 'hover:shadow-card-hover transition-shadow',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  },
  // text: {
  //   h1: 'text-4xl font-bold text-neutral-text',
  //   h2: 'text-2xl font-medium text-neutral-text',
  //   h3: 'text-xl font-medium text-neutral-text',
  //   body: 'text-base text-neutral-text',
  //   secondary: 'text-neutral-text-secondary',
  //   small: 'text-sm',
  //   error: 'text-sm text-danger',
  // },
  button: {
    base: 'rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    sizes: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    },
    variants: {
      primary: 'bg-primary text-primary-contrast hover:bg-primary-hover',
      secondary: 'bg-neutral-bg text-neutral-text-secondary hover:text-neutral-text',
      danger: 'bg-danger text-white hover:bg-danger/80',
      warning: 'bg-warning text-white hover:bg-warning/90',
      success: 'bg-success text-white hover:bg-success/80',
      link: 'text-primary hover:text-primary-hover underline',
    }
  },
  modal: {
    overlay: 'fixed inset-0 bg-neutral-text/20 backdrop-blur-sm flex items-center justify-center z-50',
    container: 'bg-neutral-white rounded-xl shadow-card w-full max-w-lg mx-4 overflow-hidden',
    header: 'flex justify-between items-center p-4 border-b border-neutral-border',
    body: 'p-4',
    footer: 'flex justify-end gap-2 p-4 border-t border-neutral-border'
  },
  form: {
    group: 'space-y-4',
    grid: 'grid grid-cols-2 gap-4',
    label: 'block text-sm text-neutral-text-secondary mb-1',
    error: 'mt-1 text-sm text-danger',
    fieldset: 'border border-neutral-border rounded-lg p-4',
    legend: 'px-2 text-sm text-neutral-text-secondary',
  },
  status: {
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  },
  animation: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
  },
  transition: {
    all: 'transition-all',
    colors: 'transition-colors',
    opacity: 'transition-opacity',
    shadow: 'transition-shadow',
    transform: 'transition-transform',
  },
  effects: {
    hover: {
      opacity: 'hover:opacity-80',
      scale: 'hover:scale-105',
      shadow: 'hover:shadow-card-hover',
    },
    active: {
      scale: 'active:scale-95',
    }
  },
  utils: {
    rounded: 'rounded-lg',
    shadow: 'shadow-card',
    border: 'border border-neutral-border',
    truncate: 'truncate',
    srOnly: 'sr-only',
  }
}; 