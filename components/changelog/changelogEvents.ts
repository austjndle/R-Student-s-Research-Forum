export const OPEN_WHATS_NEW_EVENT = "r-students:open-whats-new";

/** Opens the published release history after any active overlay has closed. */
export function requestOpenWhatsNew(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_WHATS_NEW_EVENT));
}
