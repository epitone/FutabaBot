const path = require('path')
const sqlite = require('sqlite') // eslint-disable-line func-call-spacing

(async function () { // eslint-disable-line no-unexpected-multiline
  const db = await sqlite.open(path.join(__dirname, 'database.sqlite3'))

  // setup the necessary tables
  db.exec(`
  CREATE TABLE IF NOT EXISTS "playlists" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "guild" INTEGER,
    "author" TEXT,
    "author_id" INTEGER,
    "name" TEXT,
    FOREIGN KEY("guild") REFERENCES "playlists"("guild")
  );
  CREATE TABLE IF NOT EXISTS "playlist_song"(
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "music_playlist_id" INTEGER NOT NULL,
    "provider" TEXT,
    "query" TEXT,
    "title" TEXT,
    "uri" TEXT,
    FOREIGN KEY("id") REFERENCES "playlist_song"("music_playlist_id")
  );`)

  db.close()
})()
