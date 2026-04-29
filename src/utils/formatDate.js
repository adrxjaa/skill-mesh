/**
 * Format a date string or Date object into a human-readable format.
 *
 * @param {string|Date} date - The date to format.
 * @param {object} options - Intl.DateTimeFormat options override.
 * @returns {string} Formatted date string.
 */
export function formatDate(date, options = {}) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const defaults = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return d.toLocaleDateString("en-US", defaults);
}

/**
 * Format a date as a relative time string (e.g. "2 days ago").
 *
 * @param {string|Date} date - The date to format.
 * @returns {string} Relative time string.
 */
export function timeAgo(date) {
  if (!date) return "";
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now - d) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
