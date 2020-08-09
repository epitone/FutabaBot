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
    this.logSettingsId = -1
    this.logSettings = new Map() // TODO: grab data from db for map
    this.logEvents = Object.freeze(LogEvents)
    this.ignoredLogChannels = []
  }

  setLogEvent (guild, channel, logEvent) {
    this.logSettingsId = guild.settings.get('logSettingsId', -1)
    let insertResult
    if (this.logSettingsId === -1) {
      // there are no log settings defined
      const insertLogEvent = this.database.prepare(`
        INSERT INTO log_settings (${logEvent})
        VALUES(?)
      `)
      insertResult = insertLogEvent.run(channel.id)
      if (insertResult.lastInsertRowid) { guild.settings.set('logSettingsId', insertResult.lastInsertRowid) }
    } else {
      const insertLogEvent = this.database.prepare(`
        INSERT INTO log_settings (${logEvent})
        VALUES(?)
        WHERE id = ?
      `)
      insertResult = insertLogEvent.run(channel.id, this.logSettingsId)
    }
    this.logSettings.set(`${logEvent.description}`, `${channel.id}`)
    return insertResult
  }

  getLogEventChannel (guild, logEvent) { // returns a channel for a log event, if it's enabled
    let logEventChannel = this.logSettings.get(logEvent, null)
    this.logSettingsId = guild.settings.get('logSettingsId', -1)
    if (!logEventChannel && this.logSettingsId !== -1) {
      logEventChannel = this.database.prepare(`
        SELECT ${logEvent}
        FROM log_settings
        WHERE id = ?
      `).pluck().get(this.logSettingsId)
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

  logIgnore (guild, channel) {
    // check if the channel id exists in the table
    const removeResult = this.database.prepare(`
      SELECT * FROM ignored_log_channels
      WHERE channel_id = ?
    `).get(channel.id)

    if (removeResult) { // if channel is in table, remove it
      const deletedChannelResult = this.database.prepare(`
        DELETE FROM ignored_log_channels
        WHERE channel_id = ?
      `).run(channel.id)
      if (deletedChannelResult.changes) {
        const removalIndex = this.ignoredLogChannels.indexOf(channel.id)
        if (removalIndex > -1) {
          return this.ignoredLogChannels.splice(removalIndex, 1) // return removed array item
        }
        return null // in the case of an error, return null
      }
    } else { // add it otherwise
      this.logSettingsId = guild.settings.get('logSettingsId', -1)
      if (this.logSettingsId === -1) { // there's no log settings row for this server, so we will make one
        const logSettingsResult = this.database.prepare(`
          INSERT INTO log_settings
          DEFAULT VALUES
        `).run()
        if (logSettingsResult.lastInsertRowid) {
          guild.settings.set('logSettingsId', logSettingsResult.lastInsertRowid) // update the log settings id to the newly created row id
          this.logSettingsId = logSettingsResult.lastInsertRowid
        } else { return } // something went wrong so break early
      }
      // insert channel into database
      const insertResult = this.database.prepare(`
        INSERT INTO ignored_log_channels (channel_id, log_settings_id)
        VALUES(?, ?)
      `).run(channel.id, this.logSettingsId)
      if (insertResult.changes) {
        this.ignoredLogChannels.push(channel.id)
        return insertResult
      }
      return null // shouldn't reach here but just in case something goes wrong
    }
  }
}

module.exports = { LogService, LogEvents }
