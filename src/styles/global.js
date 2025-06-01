export const styles = {
  layout: {
    container: 'container mx-auto p-4',
    section: 'mb-6',
    grid: 'grid gap-4',
    flex: 'flex items-center',
  },
  input: {
    base: 'p-2 border border-neutral-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all',
    error: 'border-danger focus:border-danger focus:ring-danger/20',
  },
  table: {
    wrapper: 'bg-neutral-white rounded-xl shadow-card overflow-hidden',
    header: 'border-b border-neutral-border',
    row: 'border-b border-neutral-border last:border-none hover:bg-neutral-bg transition-colors',
    cell: 'p-4',
    headerCell: 'text-left p-4 text-neutral-text-secondary font-medium'
  }
}; 