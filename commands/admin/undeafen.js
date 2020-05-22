const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
const winston = require('winston')

module.exports = class Deafen extends Command {
  constructor (client) {
    super(client, {
      name: 'undeafen',
      aliases: ['undef'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'undeafen', // the name of the command within the group (this can be different from the name).
      guildOnly: true,
      description: 'Undeafens mentioned user or users.',
      args: [
        {
          key: 'users',
          prompt: 'Which member(s) would you like to undeafen?',
          type: 'member',
          infinite: true
        }
      ]
    })
  }

  run (message, { users }) {
    const undeafenedStatus = []
    let index = 0

    // TODO: check which members were successfully deafened and then respond accordingly, if a member could not be defeaned, then return that user's name in the response
    for (const member of users) {
      if (member.deaf) {
        member.setDeaf(false)
          .then(undeafenedUser => {
            winston.info(`Successfully deafened ${undeafenedUser.displayName}`)
            undeafenedStatus.push(undeafenedUser)
            index++
            if (index === users.length || undeafenedStatus.length === users.length) {
              const response = `Successfully undeafened ${undeafenedStatus.length} out of ${users.length} members`
              discordUtils.embedResponse(message, {
                color: 'ORANGE',
                description: response
              })
            }
          })
          .catch(error => {
            winston.error(error)
            discordUtils.embedResponse(message, {
              color: 'RED',
              description: 'Oops! Something went wrong!'
            })
          })
      } else {
        undeafenedStatus.splice(index, 0, false)
        index++
      }
    }
  }
}
