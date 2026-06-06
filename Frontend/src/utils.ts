export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDate(date: Date | null) {
  if (!date) return null;

  return date.toISOString().split("T")[0];
}
