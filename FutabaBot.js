// TODO salt token
const Commando = require('discord.js-commando')
const path = require('path')
const Database = require('better-sqlite3')
const MusicService = require('./modules/music/services/musicservice')
const winston = require('winston')
const logger = require('./logger') // eslint-disable-line

require('dotenv').config()

let musicService

const client = new Commando.Client({
  commandPrefix: '.',
  owner: '94705001439436800'
})

const sql = new Database(path.join(__dirname, 'database.sqlite3'))
client.setProvider(new Commando.SyncSQLiteProvider(sql)).catch(console.error)

if (process.env.NODE_ENV !== 'production') {
  client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('debug', console.log)
    .on('ready', () => {
      winston.info(`Client ready; logged in as ${client.user.tag}! (${client.user.id})`)
      client.user.setActivity('with Commando')
    })
    .on('disconnect', () => { console.warn('Disconnected!') })
    .on('reconnecting', () => { console.warn('Reconnecting...') })
    .on('commandError', (cmd, err) => {
      if (err instanceof Commando.FriendlyError) return
      // console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err)
      winston.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err)
    })
    .on('providerReady', () => {
    // setup music service
      musicService = new MusicService(client.provider.conn, client)
    })
} else {
  client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('ready', () => {
      winston.info(`Client ready; logged in as ${client.user.tag}! (${client.user.id})`)
      client.user.setActivity('with Commando')
    })
    .on('disconnect', () => { console.warn('Disconnected!') })
    .on('reconnecting', () => { console.warn('Reconnecting...') })
    .on('commandError', (cmd, err) => {
      if (err instanceof Commando.FriendlyError) return
      winston.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err)
    })
    .on('providerReady', () => {
      // setup music service
      musicService = new MusicService(client.provider.conn, client)
    })
}

function getMusicService () {
  if (!musicService) {
    musicService = new MusicService(client.provider.db, client)
  }
  return musicService
}

client.registry
  .registerDefaults()
  .registerGroups([
    ['admin', 'Administrative commands'],
    ['music', 'Music-related commands']
  ])
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(process.env.TOKEN)

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error))

module.exports = { getMusicService }
