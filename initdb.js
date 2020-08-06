const path = require('path'); // eslint-disable-line
const Database = require('better-sqlite3'); // eslint-disable-line

console.log('Creating database')
const sql = new Database(path.join(__dirname, 'database.sqlite3'))

sql.prepare('CREATE TABLE IF NOT EXISTS settings (guild INTEGER PRIMARY KEY, settings TEXT)').run()

sql.prepare(`
CREATE TABLE IF NOT EXISTS "playlists" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  "guild" INTEGER,
  "author" TEXT,
  "author_id" INTEGER,
  "name" TEXT
)`).run()

sql.prepare(`
CREATE TABLE "log_settings" ( 
  "id" INTEGER PRIMARY KEY AUTOINCREMENT, "guild" INTEGER NOT NULL UNIQUE, "channel_created" INTEGER NOT NULL,
  "channel_deleted" INTEGER, "channel_updated" INTEGER, "message_deleted" INTEGER, "message_updated" INTEGER,
  "user_banned" INTEGER, "user_joined" INTEGER, "user_left" INTEGER,
  "user_muted" INTEGER, "user_presence" INTEGER, "user_unbanned" INTEGER,
  "user_updated" INTEGER, "voice_presence" INTEGER)
`).run()

sql.prepare(`
CREATE TABLE IF NOT EXISTS "playlist_song" (
 "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
 "music_playlist_id" INTEGER NOT NULL,
 "provider" TEXT,
 "query" TEXT,
 "title" TEXT,
 "uri" TEXT,
 FOREIGN KEY("music_playlist_id") REFERENCES "playlists"("id") ON DELETE CASCADE
)`).run()

sql.prepare(`
CREATE TABLE IF NOT EXISTS "playing_status" (
 "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  "guild" INTEGER NOT NULL,
 "status_type"  TEXT NOT NULL,
 "status_string" TEXT NOT NULL
)`).run()

console.log('Tables created, closing database')
sql.close()
