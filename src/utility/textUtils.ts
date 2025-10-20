export function formatSnackLabels(rawLabel: string): string {
  if (!rawLabel) return "-";
  return rawLabel
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
