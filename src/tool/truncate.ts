export function truncate(content: string, max: number): string {
  if (content.length <= max) return content;
  return (
    content.slice(0, max) +
    `\n[truncated: showing first ${max} of ${content.length} chars. Narrow the query.]`
  );
}

// recursively truncate the string output
export function truncateStrings(value: unknown, max: number): unknown {
  if (typeof value === "string") return truncate(value, max);
  if (Array.isArray(value))
    return value.map((item) => truncateStrings(item, max));
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        truncateStrings(val, max),
      ]),
    );
  }
  return value;
}
