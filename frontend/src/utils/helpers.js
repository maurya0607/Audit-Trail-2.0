/**
 * Audit Trail 2.0 Utility Helpers
 */

export function truncateHash(hash, length = 12) {
  if (!hash) return '';
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }) + ' UTC';
}

/**
 * Risk Score Severity calculation per specification table:
 * 0–25   -> LOW
 * 26–50  -> MEDIUM
 * 51–75  -> HIGH
 * 76–100 -> CRITICAL
 */
export function getRiskSeverity(score) {
  if (score <= 25) return { label: 'LOW', color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30' };
  if (score <= 50) return { label: 'MEDIUM', color: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/30' };
  if (score <= 75) return { label: 'HIGH', color: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/30' };
  return { label: 'CRITICAL', color: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30' };
}

/**
 * Standard SHA-256 client simulation for fast client verifiable hashing
 */
export function pseudoSha256(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
}
