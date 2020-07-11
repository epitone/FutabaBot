const winston = require('winston')
const BotStatus = require('../../../modules/admin/botstatus')
const { Guild, TextChannel } = require('discord.js') // eslint-disable-line

class AdminService {
  constructor (database, client) {
    // console.info('Setting up music service')
    winston.info('Setting up admin service')
    this.client = client
    this.database = database
    winston.info('Admin service Initialized')
    this.playingStatuses = []
  }

  getAutoAssignRole (guild) {
    const autoAssignRole = guild.settings.get('autoAssignRole', null)
    return autoAssignRole ? typeof autoAssignRole !== 'undefined' ? autoAssignRole : null : null
  }

  setAutoAssignRole (guild, roleID) {
    winston.info(`Setting AAR ID to ${roleID}`)
    return guild.settings.set('autoAssignRole', roleID)
  }

  setDefaultMuteRole (guild, role) {
    winston.info(`Setting default mute role to “${role.name}” (${role.id})`)
    return guild.settings.set('defaultMuteRole', role.id)
  }

  getDefaultMuteRole (guild) {
    const defaultMuteRole = guild.settings.get('defaultMuteRole', null)
    return defaultMuteRole ? typeof defaultMuteRole !== 'undefined' ? defaultMuteRole : null : null
  }

  getPlayingStatuses (guild) {
    // check if there are any statuses stored in memory
    if (this.playingStatuses.length !== 0) {
      return this.playingStatuses
    }
    const selectStatuses = this.database.prepare(`
        SELECT id, status_type, status_string
        FROM playing_status
        WHERE guild = ?
      `).run(guild.id)
    console.debug(selectStatuses)
  }

  addPlayingStatus (guild, playingStatus, status) {
    const newPlayingStatus = new BotStatus(guild.id, playingStatus, status)
    this.playingStatuses.push(newPlayingStatus)
    const result = this.database.prepare(`
      INSERT INTO playing_status(guild, status_type, status_string)
      VALUES(?, ?, ?)
    `).run(guild.id, playingStatus, status)
    return result.changes
  }

  leaveGuild (guild) {
    const deletePlaylists = this.database.prepare(`
      DELETE FROM playlists
      WHERE guild = ?
    `)

    const deleteGuildSettings = this.database.prepare(`
      DELETE FROM settings
      WHERE guild = ?
    `)
    const deletePlayingStatuses = this.database.prepare(`
      DELETE FROM playing_status
      WHERE guild = ?
    `)
    const deleteMany = this.database.transaction((guild) => {
      deletePlaylists.run(guild.id)
      deleteGuildSettings.run(guild.id)
      deletePlayingStatuses.run(guild.id)
    })
    deleteMany(guild)
  }

  setGreetingChannel (guild, channel) {
    winston.info(`Setting greeting channel for server ${guild.id}: ${channel !== null ? channel.name : null}`)
    guild.settings.set('greetingChannel', channel ? channel.id : null)
  }

  getGreetingChannel (guild) {
    winston.info(`Retrieving greeting channel for server ${guild.id}`)
    return guild.settings.get('greetingChannel', null)
  }

  setGreetingTimeout (guild, timeout) {
    winston.info(`Setting greeting timeout for server ${guild.id}: ${timeout} milliseconds`)
    guild.settings.set('greetingTimeout', timeout)
  }

  getGreetingTimeout (guild) {
    winston.info(`Retrieving greeting timeout for server ${guild.id}`)
    return guild.settings.get('greetingTimeout', 0)
  }

  setGreetingMessage (guild, greeting, embed = false) {
    winston.info(`Setting greeting message for server ${guild.id}: ${greeting} (embed enabled: ${embed})`)
    guild.settings.set('greetingMessage', greeting)
    guild.settings.set('greetingEmbed', embed)
  }

  getGreetingMessage (guild) {
    winston.info(`Getting greeting message for server: ${guild.id}`)
    return { greetingMsg: guild.settings.get('greetingMessage', null), embed: guild.settings.get('greetingEmbed', false) }
  }

  setGoodbyeChannel (guild, channel) {
    winston.info(`Setting goodbye channel for server ${guild.id}: ${channel !== null ? channel.name : null}`)
    guild.settings.set('leavingChannel', channel ? channel.id : null)
  }

  getGoodbyeChannel (guild) {
    winston.info(`Retrieving goodbye channel for server ${guild.id}`)
    return guild.settings.get('leavingChannel', null)
  }

  setGoodbyeMessage (guild, byeMsg, embed = false) {
    winston.info(`Setting goodbye message for server ${guild.id}: ${byeMsg} (embed enabled: ${embed})`)
    guild.settings.set('leaveMessage', byeMsg)
    guild.settings.set('leaveEmbed', embed)
  }

  getGoodbyeMessage (guild) {
    winston.info(`Getting goodbye message for server: ${guild.id}`)
    return { byeMsg: guild.settings.get('leaveMessage', null), embed: guild.settings.get('leaveEmbed', false) }
  }

  setGoodbyeTimeout (guild, timeout) {
    winston.info(`Setting goodbye message timeout for server ${guild.id}: ${timeout} milliseconds`)
    guild.settings.set('leavingTimeout', timeout)
  }

  getGoodbyeTimeout (guild) {
    winston.info(`Retrieving goodbye message timeout for server ${guild.id}`)
    return guild.settings.get('leavingTimeout', 0)
  }

  setLogChannel (guild, channel) {
    winston.info(`Setting server log channel for server ${guild.id}`)
    guild.settings.set('logServer', channel ? channel.id : null)
  }

  getLogChannel (guild) {
    winston.info(`Getting server log channel for server ${guild.id}`)
    return guild.settings.get('logServer', null)
  }

  /**
   * Adds a channel to the logignore list for the server
   * @param {Guild} guild
   * @param {TextChannel} channel
   */
  addToLogIgnoreList (guild, channel) {
    winston.info(`Adding ${channel} to logignore list for server: ${guild.id}`)
    const ignoreList = guild.settings.get('logIgnoreList', [])
    ignoreList.push(channel.id)
    guild.settings.set('logIgnoreList', ignoreList)
  }

  /**
   * Removes the specified channel from the list of ignored channels for server logging
   * @param {Guild} guild
   * @param {TextChannel} channel
   */
  removeFromLogIgnoreList (guild, channel) {
    winston.info(`Removing ${channel} from logignore list for server: ${guild.id}`)
    const logIgnoreList = guild.settings.get('logIgnoreList', [])
    if (logIgnoreList.length === 0) {
      // empty array so we shouldn't be removing anything, something's wrong here
      winston.warn(`Something went wrong when removing ${channel.id} from ${guild.id} logignore list`)
      return null
    }
    const index = logIgnoreList.indexOf(channel.id)
    let removedValue; // eslint-disable-line
    if (index > -1) {
      removedValue = logIgnoreList.splice(index, 1)
    }
    guild.settings.set('logIgnoreList', logIgnoreList)
    return removedValue // return removed item
  }

  getLogIgnoreList (guild) {
    winston.info(`Getting logignore list for server: ${guild.id}`)
    return guild.settings.get('logIgnoreList', [])
  }
}
module.exports = AdminService
