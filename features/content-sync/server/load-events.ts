import type { MonitoredEvent } from "../domain/types";
import { WorkerContentSyncStore } from "./worker-store";

export async function getDynamicEvents(env: { CONTENT_SYNC_DO?: DurableObjectNamespace }): Promise<MonitoredEvent[]> {
  if (!env.CONTENT_SYNC_DO) return [];
  try {
    return await new WorkerContentSyncStore(env.CONTENT_SYNC_DO).events();
  } catch {
    return [];
  }
}
