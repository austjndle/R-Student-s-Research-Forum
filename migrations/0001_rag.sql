-- Optional RAG index migration. This is not activated until D1 is provisioned and reviewed.
CREATE TABLE IF NOT EXISTS rag_sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  authority_level INTEGER NOT NULL CHECK (authority_level BETWEEN 1 AND 4),
  campus TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL,
  document_type TEXT NOT NULL,
  published_at TEXT,
  last_verified TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  source_version TEXT NOT NULL,
  ingestion_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rag_chunks (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES rag_sources(id),
  text TEXT NOT NULL,
  title TEXT NOT NULL,
  section TEXT,
  campus TEXT NOT NULL,
  category TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  page_number INTEGER,
  building TEXT,
  floor TEXT,
  room TEXT,
  language TEXT NOT NULL,
  last_verified TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  embedding_version TEXT NOT NULL,
  authority_level INTEGER NOT NULL,
  verification_status TEXT NOT NULL,
  metadata_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rag_chunks_campus_category ON rag_chunks(campus, category);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_source ON rag_chunks(source_id);
CREATE VIRTUAL TABLE IF NOT EXISTS rag_chunks_fts USING fts5(
  chunk_id UNINDEXED,
  title,
  section,
  text,
  content='rag_chunks',
  content_rowid='rowid'
);

CREATE TRIGGER IF NOT EXISTS rag_chunks_ai AFTER INSERT ON rag_chunks BEGIN
  INSERT INTO rag_chunks_fts(rowid, chunk_id, title, section, text) VALUES (new.rowid, new.id, new.title, new.section, new.text);
END;
CREATE TRIGGER IF NOT EXISTS rag_chunks_ad AFTER DELETE ON rag_chunks BEGIN
  INSERT INTO rag_chunks_fts(rag_chunks_fts, rowid, chunk_id, title, section, text) VALUES ('delete', old.rowid, old.id, old.title, old.section, old.text);
END;
CREATE TRIGGER IF NOT EXISTS rag_chunks_au AFTER UPDATE ON rag_chunks BEGIN
  INSERT INTO rag_chunks_fts(rag_chunks_fts, rowid, chunk_id, title, section, text) VALUES ('delete', old.rowid, old.id, old.title, old.section, old.text);
  INSERT INTO rag_chunks_fts(rowid, chunk_id, title, section, text) VALUES (new.rowid, new.id, new.title, new.section, new.text);
END;
