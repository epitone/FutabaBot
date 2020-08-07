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

  setLogServerChannel (guild, channel) {
    const allEvents = Object.values(this.logEvents.events)
    let insertClause = '(guild, '
    let insertValues = `(${guild.id}, `
    let iterations = allEvents.length

    for (const event of allEvents) {
      this.logSettings.set(event.description, `${channel ? channel.id : null}`)
      if (!--iterations) {
        insertClause += `${event.description})`
        insertValues += `${channel ? channel.id : null})`
      } else {
        insertClause += `${event.description}, `
        insertValues += `${channel ? channel.id : null}, `
      }
    }

    const result = this.database.prepare(`
      INSERT INTO log_settings ${insertClause}
      VALUES ${insertValues}
      ON CONFLICT(guild)
      DO UPDATE SET
      channel_created = excluded.channel_created,
      channel_deleted = excluded.channel_deleted,
      channel_updated = excluded.channel_updated,
      message_deleted = excluded.message_deleted,
      message_updated = excluded.message_updated,
      user_banned = excluded.user_banned,
      user_joined = excluded.user_joined,
      user_left = excluded.user_left,
      user_muted = excluded.user_muted,
      user_presence = excluded.user_presence,
      user_unbanned = excluded.user_unbanned,
      user_updated = excluded.user_updated,
      voice_presence = excluded.voice_presence
    `).run()
    return result
  }
}

module.exports = { LogService, LogEvents }
