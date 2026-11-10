export interface WorkerEnv {
  AI_QUOTA_DO: DurableObjectNamespace;
  EVENT_REVIEW_DO: DurableObjectNamespace;
  CONTENT_SYNC_DO?: DurableObjectNamespace;
  CONTENT_SYNC_ENABLED?: string;
  EVENT_ADMIN_TOKEN?: string;
  AI_GLOBAL_DAILY_LIMIT?: string;
  CAMPUS_BUZZ_INGEST_TOKEN?: string;
  AI?: {
    run: (model: string, input: Record<string, unknown>) => Promise<any>;
  };
  AI_DAILY_LIMIT: string;
  APP_TIMEZONE: string;
  GEMINI_MODEL: string;
  GEMINI_API_KEY: string;
  ANONYMOUS_SESSION_SECRET: string;
  ASSETS?: Fetcher;
}
