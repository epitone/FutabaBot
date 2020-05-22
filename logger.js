const winston = require('winston')
const { format } = require('winston')
const path = require('path')
require('dotenv').config()

// Set this to whatever, by default the path of the script.
const logPath = path.join(__dirname, '/logs')
const tsFormat = () => (new Date().toISOString())

const alignedWithColorsAndTime = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
)

// remove default options
winston.remove(winston.transports.Console)
winston.remove(winston.transports.File)

const infoTransportFile = new winston.transports.File({
  filename: path.join(logPath, 'main.log'),
  timestamp: tsFormat,
  level: 'info',
  format: alignedWithColorsAndTime
})

const errorTransportFile = new winston.transports.File({
  filename: path.join(logPath, 'error.log'),
  timestamp: tsFormat,
  level: 'error',
  format: alignedWithColorsAndTime
})

const devTransportConsole = new winston.transports.Console({
  level: 'info',
  format: alignedWithColorsAndTime
})

winston.add(infoTransportFile)
winston.add(errorTransportFile)

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  winston.add(devTransportConsole)
}
