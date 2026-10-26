export function currency(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

/**
 * Map a finance_status onto one of the shared status-badge styles, so money
 * states read the same as event states without inventing a second palette.
 */
export function financeBadge(status: string): string {
  if (status === 'submitted') return 'submitted';
  if (status === 'approved' || status === 'paid') return 'published';
  if (status === 'rejected') return 'cancelled';
  if (status === 'changes_requested') return 'changes_requested';
  return 'draft';
}
