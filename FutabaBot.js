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
    const channelID = logService.getLogEventChannel(guild, 'channel_created')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '🆕 Text channel created',
      description: `${channel} | ${channel.id}`
    },
    logChannel)
  })
  .on('channelDelete', async (channel) => {
    // TODO: add timestamps to logging outputs
    const guild = channel.guild
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'channel_deleted')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '🗑 Text channel deleted',
      description: `${channel} | ${channel.id}`
    },
    logChannel)
  })
  .on('channelUpdate', async (oldChannel, newChannel) => {
    // TODO: add timestamps to logging outputs
    const guild = newChannel.guild
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'channel_deleted')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '🆕 Channel Updated',
      description: `${oldChannel} updated, see ${newChannel} | ${newChannel.id}`
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
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'user_joined')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '👋🏾 User joined',
      description: `${member} joined.`
    },
    logChannel)
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
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'user_left')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    const fetchedLogs = await guild.fetchAuditLogs({
      type: 'MEMBER_KICK',
      limit: 1
    })
    const kickLog = fetchedLogs.entries.first()
    if (kickLog) { return } // the user didn't leave on their own but was kicked
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '👋🏾 User left',
      description: `${member} left.`
    },
    logChannel)
  })
  .on('messageDelete', async (message) => {
    if (!message.guild) return
    const guild = message.guild
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'message_deleted')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '🗑 Message deleted',
      description: `Message deleted. (Message text: ${message.content})`
    },
    logChannel)
  })
  .on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.author.id === client.user.id) { return } // ignore any bot messages
    if (!oldMessage.guild) return
    const guild = newMessage.guild
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'message_updated')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '🆕 Message updated ',
      description: `Message updated. (Old Message ID: ${oldMessage.id} | New Message ID: ${newMessage.id})`
    },
    logChannel)
  })
  .on('guildBanAdd', async (guild, user) => {
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'user_banned')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '🚫 User Banned',
      description: `${user} banned.`
    },
    logChannel)
  })
  .on('guildBanRemove', async (guild, user) => {
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'user_unbanned')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '✅ User Unbanned',
      description: `${user} unbanned.`
    },
    logChannel)
  })
  .on('voiceStateUpdate', async (oldState, newState) => {
    if (!newState.muted) { return }
    const guild = newState.guild
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'user_muted')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '🔇 User muted',
      description: `${newState.member} muted.`
    },
    logChannel)
  })
  .on('presenceUpdate', async (oldPresence, newPresence) => {
    const guild = newPresence.guild
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'user_presence')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    if (!oldPresence) {
      discordUtils.embedResponse(null, {
        color: 'ORANGE',
        title: '❗ User presence changed',
        description: `${newPresence.member} status or activity changed.`
      },
      logChannel)
    } else {
      if (oldPresence.status !== newPresence.status) {
        discordUtils.embedResponse(null, {
          color: 'ORANGE',
          title: '❗ User presence changed',
          description: `${newPresence.member} status changed.`
        },
        logChannel)
      } else {
        discordUtils.embedResponse(null, {
          color: 'ORANGE',
          title: '❗ User presence changed',
          description: `${newPresence.member} activity changed.`
        },
        logChannel)
      }
    }
  })
  .on('guildMemberUpdate', async (oldMember, newMember) => {
    const guild = newMember.guild
    logService = getLogService()
    const channelID = logService.getLogEventChannel(guild, 'user_updated')
    if (!channelID) { return }
    const logChannel = guild.channels.cache.find(channel => parseInt(channel.id) === channelID)
    if (!logChannel) { return }
    discordUtils.embedResponse(null, {
      color: 'ORANGE',
      title: '🎭 User updated',
      description: `${newMember} information updated`
    },
    logChannel)
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
