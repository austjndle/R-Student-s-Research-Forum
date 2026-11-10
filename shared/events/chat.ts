export const OPEN_MR_HACHIWARE_EVENT = "r-students:open-mr-hachiware";

export function requestOpenMrHachiware(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_MR_HACHIWARE_EVENT));
}
