const path = require('path'); // eslint-disable-line
const Database = require('better-sqlite3'); // eslint-disable-line

console.log('Creating database')
const sql = new Database(path.join(__dirname, 'database.sqlite3'))

sql.prepare('CREATE TABLE IF NOT EXISTS settings (guild INTEGER PRIMARY KEY, settings TEXT)').run()

sql.prepare(`
CREATE TABLE IF NOT EXISTS "playlists" (
  "id" INTEGER NOT NULL CONSTRAINT "PK_playlists" PRIMARY KEY AUTOINCREMENT,
  "guild" INTEGER,
  "author" TEXT,
  "author_id" INTEGER,
  "name" TEXT
)`).run()

sql.prepare(`
CREATE TABLE IF NOT EXISTS "log_settings" ( 
  "id" INTEGER PRIMARY KEY AUTOINCREMENT, "channel_created" INTEGER,
  "channel_deleted" INTEGER, "channel_updated" INTEGER, "message_deleted" INTEGER, "message_updated" INTEGER,
  "user_banned" INTEGER, "user_joined" INTEGER, "user_left" INTEGER,
  "user_muted" INTEGER, "user_presence" INTEGER, "user_unbanned" INTEGER,
  "user_updated" INTEGER, "voice_presence" INTEGER)
`).run()

sql.prepare(`
CREATE TABLE IF NOT EXISTS "ignored_log_channels" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT, "channel_id" INTEGER NOT NULL,
  "log_settings_id" INTEGER NULL, "date_added" TEXT NULL,
  CONSTRAINT "FK_ignoredlogchannels_logsettings_logsettingsid" FOREIGN KEY ("log_settings_id") REFERENCES log_settings("id") ON DELETE RESTRICT
  CREATE INDEX "IX_ignoredlogchannels_logsettingsid" ON "ignored_log_channels" ("log_settings_id");
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
 "status_string" TEXT NOT NULL
)`).run()

sql.prepare(`
CREATE TABLE IF NOT EXISTS "warnings" (
  "id" INTEGER NOT NULL CONSTRAINT "PK_Warnings" PRIMARY KEY AUTOINCREMENT,
  "date_added" TEXT NULL,
  "forgiven" INTEGER NOT NULL,
  "forgiven_by" TEXT NULL,
  "guild_id" INTEGER NOT NULL,
  "moderator" TEXT NULL,
  "reason" TEXT NULL,
  "user_id" INTEGER NOT NULL
);
CREATE INDEX "IX_warnings_dateadded" ON "Warnings" ("date_added");
CREATE INDEX "IX_warnings_guildid" ON "Warnings" ("guild_id");
CREATE INDEX "IX_warnings_userid" ON "Warnings" ("user_id");
`)

console.log('Tables created, closing database')
sql.close()
