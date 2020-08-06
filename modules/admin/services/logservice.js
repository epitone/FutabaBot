const winston = require('winston')

const LogEvents = {
  events: {
    ChannelCreated: Symbol('channel_created'),
    ChannelDeleted: Symbol('channel_deleted'),
    ChannelUpdated: Symbol('channel_updated'),
    MessageDeleted: Symbol('message_deleted'),
    MessageUpdated: Symbol('message_updated'),
    UserBanned: Symbol('user_banned'),
    UserJoined: Symbol('user_joined'),
    UserLeft: Symbol('user_left'),
    UserMuted: Symbol('user_muted'),
    UserPresence: Symbol('user_presence'),
    UserUnbanned: Symbol('user_unbanned'),
    UserUpdated: Symbol('user_updated'),
    VoicePresence: Symbol('voice_presence')
  },
  getEvent (event) {
    return this.events[event]
  }
}

class LogService {
  constructor (database) {
    winston.info('Setting up log service')
    this.database = database
    winston.info('Log service Initialized')
    this.logSettings = new Map() // TODO: grab data from db for map
    this.logEvents = Object.freeze(LogEvents)
  }

  setLogEvent (guild, channel, logEvent) {
    this.logSettings.set(`${logEvent.description}`, `${channel.id}`)
    const insertLogEvent = this.database.prepare(`
      INSERT INTO log_settings (guild, ${logEvent})
      VALUES(?, ?)
      ON CONFLICT(guild)
      DO UPDATE SET ${logEvent}=?;
    `)
    const success = insertLogEvent.run(guild.id, channel.id, channel.id)
    return success
  }

  getLogEventChannel (guild, logEvent) { // returns a channel for a log event, if it's enabled
    let logEventChannel = this.logSettings.get(logEvent, null)
    if (!logEventChannel) {
      logEventChannel = this.database.prepare(`
        SELECT ${logEvent}
        FROM log_settings
        WHERE guild = ?
      `).pluck().get(guild.id)
    }
    return logEventChannel
  }
}

module.exports = { LogService, LogEvents }
