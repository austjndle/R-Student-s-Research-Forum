export const OPEN_SUPPORT_EVENT = "r-students:open-support";

export function requestOpenSupport(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_SUPPORT_EVENT));
}
