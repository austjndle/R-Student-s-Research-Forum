const APP_TIMEZONE = "Asia/Ho_Chi_Minh";

export function formatLocalizedDate(value: string | undefined, language: "en" | "vi", options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  if (!value) return language === "vi" ? "Chưa công bố" : "Not published";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", { ...options, timeZone: APP_TIMEZONE }).format(date);
}

export function formatLocalizedDateTime(value: string | undefined, language: "en" | "vi"): string {
  if (!value) return language === "vi" ? "Chưa công bố" : "Not published";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: APP_TIMEZONE,
  }).format(date);
}

export { APP_TIMEZONE };
