// TODO salt token
const Commando = require('discord.js-commando')
const path = require('path')
const Database = require('better-sqlite3')
const MusicService = require('./modules/music/services/musicservice')
const AdminService = require('./modules/admin/services/adminservice')
const winston = require('winston')
const logger = require('./logger') // eslint-disable-line

require('dotenv').config()

let musicService
let adminService

const client = new Commando.Client({
  commandPrefix: '.',
  owner: '94705001439436800'
})

const sql = new Database(path.join(__dirname, 'database.sqlite3'))
client.setProvider(new Commando.SyncSQLiteProvider(sql)).catch(console.error)

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
    winston.info('Setting up services...')
    musicService = new MusicService(client.provider.conn, client)
    adminService = new AdminService(client.provider.conn, client)
    winston.info('Service setup complete')
  })
  .on('guildMemberAdd', async (member) => {
    const guild = member.guild
    const adminService = getAdminService()
    const aarID = await adminService.getAutoAssignRole(guild)
    if (aarID !== null) {
      const role = member.guild.roles.cache.get(aarID)
      winston.info(`Auto assign role active, giving member ${member.id} the role “${role.name}”`)
      const memberWithRole = await member.roles.set([aarID])
      if (memberWithRole.roles.cache.has(aarID)) {
        winston.info(`Successfully assigned “${role.name}” to ${memberWithRole.user.tag}`)
      }
    }
  })

if (process.env.NODE_ENV !== 'production') client.on('debug', console.log)

function getMusicService () {
  if (!musicService) {
    musicService = new MusicService(client.provider.conn, client)
  }
  return musicService
}

function getAdminService () {
  if (!adminService) {
    adminService = new AdminService(client.provider.conn, client)
  }
  return adminService
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

module.exports = { getMusicService, getAdminService }
