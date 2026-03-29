-- Emoji support migration guide
-- Use these statements only if you are on SQL databases (MySQL/PostgreSQL).
-- Firestore (current project backend) already supports emoji storage.

-- =========================
-- MySQL / MariaDB (utf8mb4)
-- =========================

-- 1) Database charset/collation
-- ALTER DATABASE diet_fitness_app CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 2) Example table/column updates
-- ALTER TABLE chat_messages CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- ALTER TABLE chat_messages MODIFY COLUMN message TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- ALTER TABLE plans MODIFY COLUMN notes TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- ===========
-- PostgreSQL
-- ===========

-- PostgreSQL already stores UTF-8 text in TEXT/VARCHAR by default.
-- Verify DB/server encoding:
-- SHOW SERVER_ENCODING;
-- SHOW CLIENT_ENCODING;

-- If needed, ensure client encoding is UTF-8:
-- SET client_encoding = 'UTF8';

-- Optional validation query with emoji:
-- INSERT INTO chat_messages (message) VALUES ('Merhaba 👋 Plan hazır 🎉');
-- SELECT message FROM chat_messages ORDER BY id DESC LIMIT 1;
