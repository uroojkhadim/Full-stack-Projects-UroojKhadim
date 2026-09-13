// src/utils/formatters.ts

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(amount).replace('PKR', 'Rs.');
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function getCleanImageUrl(path: string): string {
  if (!path) return './images/background image.jpeg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('./') || path.startsWith('/')) return path;
  return `./${path}`;
}
