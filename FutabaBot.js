// TODO salt token
const Commando = require('discord.js-commando')
const path = require('path')
const Database = require('better-sqlite3')
const MusicService = require('./modules/music/services/musicservice')
const AdminService = require('./modules/admin/services/adminservice')
const { LogService } = require('./modules/admin/services/logservice')
const winston = require('winston')
const logger = require('./logger') // eslint-disable-line
const discordUtils = require('./utils/discord-utils')

require('dotenv').config()

let musicService
let adminService
let logService
let constants

const client = new Commando.Client({
  commandPrefix: '.',
  owner: '94705001439436800'
})

const sql = new Database(path.join(__dirname, 'database.sqlite3'))
client.setProvider(new Commando.SyncSQLiteProvider(sql)).catch(console.error)

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('ready', async () => {
    winston.info(`Client ready; logged in as ${client.user.tag}! (${client.user.id})`)
    client.user.setActivity('with Commando')
  })
  .on('disconnect', () => { console.warn('Disconnected!') })
  .on('reconnecting', () => { console.warn('Reconnecting...') })
  .on('commandError', (cmd, err) => {
    if (err instanceof Commando.FriendlyError) return
    winston.error(`Error in command ${cmd.groupID}:${cmd.memberName} `, err)
  })
  .on('providerReady', () => {
  // setup music service
    winston.info('Setting up services...')
    musicService = new MusicService(client.provider.conn, client)
    adminService = new AdminService(client.provider.conn, client)
    winston.info('Service setup complete')
  })
  .on('channelCreate', async (channel) => {
    // TODO: add timestamps to logging outputs
    const guild = channel.guild
    logService = getLogService()
    // automated id: 730853412958371840
    const channelID = logService.getLogEventChannel(guild, 'channel_created')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => {
      winston.info(`Channel: ${channel.name} (${channel.id})`)
      return parseInt(channel.id) === channelID
    })
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '🆕 Text channel created',
      description: `${channel} | ${channel.id}`
    },
    logChannel)
  })
  .on('guildCreate', async (guild) => {
    winston.info(`Bot joined server ${guild}`)
  })
  .on('guildMemberAdd', async (member) => {
    const guild = member.guild
    const adminService = getAdminService()
    const aarID = await adminService.getAutoAssignRole(guild)
    const greetingChannelID = adminService.getGreetingChannel(guild)
    if (aarID !== null) {
      const role = member.guild.roles.cache.get(aarID)
      winston.info(`Auto assign role active, giving member ${member.id} the role “${role.name}”`)
      const memberWithRole = await member.roles.set([aarID])
      if (memberWithRole.roles.cache.has(aarID)) {
        winston.info(`Successfully assigned “${role.name}” to ${memberWithRole.user.tag}`)
      }
    }
    if (greetingChannelID) {
      // TODO: when we create the greetmsg command, replace this code here
      const greetingChannel = guild.channels.cache.get(greetingChannelID)
      if (greetingChannel) {
        const timeoutMilliseconds = adminService.getGreetingTimeout(guild)
        const { greetingMsg, embed } = adminService.getGreetingMessage(guild)
        if (greetingMsg) {
          if (embed) {
            discordUtils.embedResponse(null, {
              color: 'ORANGE',
              description: greetingMsg.replace(/\$user.mention\$/gi, member)
            },
            greetingChannel,
            timeoutMilliseconds)
          } else {
            const message = await greetingChannel.send(greetingMsg.replace(/\$user.mention\$/gi, member))
            if (timeoutMilliseconds > 0) message.delete({ timeout: timeoutMilliseconds })
          }
        }
      } else {
        winston.error(`Couldn't find channel with id: ${greetingChannelID}`)
      }
    }
  })
  .on('guildMemberRemove', async (member) => {
    const guild = member.guild
    const adminService = getAdminService()
    const leavingChannelID = adminService.getGoodbyeChannel(guild)
    if (leavingChannelID) {
      const leavingChannel = guild.channels.cache.get(leavingChannelID)
      if (leavingChannel) {
        const timeoutMilliseconds = adminService.getGoodbyeTimeout(guild)
        const { byeMsg, embed } = adminService.getGoodbyeMessage(guild)
        if (byeMsg) {
          if (embed) {
            discordUtils.embedResponse(null, {
              color: 'ORANGE',
              description: byeMsg.replace(/\$user.mention\$/gi, member)
            },
            leavingChannel,
            timeoutMilliseconds)
          } else {
            const message = await leavingChannel.send(byeMsg.replace(/\$user.mention\$/gi, member))
            if (timeoutMilliseconds > 0) message.delete({ timeout: timeoutMilliseconds })
          }
        }
      } else {
        winston.error(`Couldn't find channel with id: ${leavingChannelID}`)
      }
    }
  })

if (process.env.NODE_ENV !== 'production') {
  client.on('debug', info => {
    console.log(info)
    winston.info(info)
  })
}

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

function getLogService () {
  if (!logService) {
    logService = new LogService(client.provider.conn)
  }
  return logService
}

function getConstants () {
  if (!constants) constants = new(require(`./languages/${process.env.lang}`)) // eslint-disable-line
  return constants
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

module.exports = { getMusicService, getAdminService, getConstants, getLogService }
