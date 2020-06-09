const winston = require('winston')

class AdminService {
  constructor (database, client) {
    // console.info('Setting up music service')
    winston.info('Setting up admin service')
    this.client = client
    this.database = database
    winston.info('Admin service Initialized')
    this.playingStatuses = {}
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
    let playingStatuses = guild.settings.get('playingStatuses', null)
    if (playingStatuses) {
      return playingStatuses
    } else {
      const selectStatuses = this.database.prepare(`
        SELECT id, status_type, status_string
        FROM playing_status
        WHERE guild = ?
      `).run(guild.id)
      console.debug(selectStatuses)
    }
  }
}
module.exports = AdminService
