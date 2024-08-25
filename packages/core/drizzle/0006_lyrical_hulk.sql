CREATE INDEX IF NOT EXISTS "tags_search_index" ON "problem" USING gin (to_tsvector('english', tags));
