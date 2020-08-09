const winston = require('winston')
class PunishService {
  constructor (database, guild) {
    winston.info('Setting up log service')
    this.database = database
  }
}
