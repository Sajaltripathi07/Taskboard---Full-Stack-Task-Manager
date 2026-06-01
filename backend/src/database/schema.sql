-- Task Manager Database Schema


-- Users table: stores registered accounts
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,           -- UUID v4
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,       -- enforced unique at DB level
  password    TEXT NOT NULL,              -- bcrypt hash, never plaintext
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index for fast email lookups during login
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Tasks table: each task belongs to exactly one user
CREATE TABLE IF NOT EXISTS tasks (
  id          TEXT PRIMARY KEY,           -- UUID v4
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  stage       TEXT NOT NULL DEFAULT 'TODO'
                CHECK(stage IN ('TODO', 'IN_PROGRESS', 'DONE')),
  user_id     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for fast per-user task fetching
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Index for stage-based filtering
CREATE INDEX IF NOT EXISTS idx_tasks_stage ON tasks(stage);
