const path = require('path'); // eslint-disable-line
const Database = require('better-sqlite3'); // eslint-disable-line

console.log('Creating database')
const sql = new Database(path.join(__dirname, 'database.sqlite3'))

const createPlaylists = sql.prepare(`
CREATE TABLE "playlists" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  "guild" INTEGER,
  "author" TEXT,
  "author_id" INTEGER,
  "name" TEXT)`)

createPlaylists.run()

const createPlaylistSongs = sql.prepare(`
CREATE TABLE "playlist_song" (
 "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
 "music_playlist_id" INTEGER NOT NULL,
 "provider" TEXT,
 "query" TEXT,
 "title" TEXT,
 "uri" TEXT,
 FOREIGN KEY("music_playlist_id") REFERENCES "playlists"("id") ON DELETE CASCADE
)`)

createPlaylistSongs.run()
console.log('Tables created, closing database')
sql.close()
