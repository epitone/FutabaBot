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
  "name" TEXT,
  FOREIGN KEY("guild") REFERENCES "settings"("guild") ON DELETE CASCADE
)`).run()

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
 "status_string" TEXT NOT NULL,
 FOREIGN KEY("guild") REFERENCES "settings"("guild") ON DELETE CASCADE
)`).run()

console.log('Tables created, closing database')
sql.close()
