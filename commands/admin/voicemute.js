const { Command } = require('discord.js-commando')
const { Permissions } = require('discord.js')
const discordUtils = require('./../../utils/discord-utils')

// TODO: check edge cases for this command

module.exports = class VoiceMute extends Command {
  constructor (client) {
    super(client, {
      name: 'voicemute',
      group: 'admin',
      memberName: 'voicemute',
      description: 'Prevents a mentioned user from speaking in voice channels.',
      args: [
        {
          key: 'user',
          prompt: 'What user would you like to mute?',
          type: 'member'
        }
      ]
    })
  }

  async run (message, { user }) {
    let muteRole = message.guild.roles.find('name', 'voice muted')
    if (!muteRole) {
      const voiceMutedPermissions = new Permissions(67492928) // see https://discordapi.com/permissions.html#67492928
      message.guild.createRole({
        name: 'voice muted',
        permissions: voiceMutedPermissions
      })
        .then((role) => {
          for (const [, channel] of message.guild.channels) {
            if (channel.type === 'voice') {
              channel.overwritePermissions(role, {
                CONNECT: false,
                SPEAK: false
              })
                .then(updated => console.log(`new permissions for #${updated.name}: ${JSON.stringify(updated.permissionsFor(role))}`))
                .catch(console.error)
            }
          }
          console.log(`created role with name ${role.name}`)
          muteRole = role
        })
    }
    user.setVoiceChannel(null) // remove user from any voice channels first
      .then(removedUser => {
        console.log(`Successfully removed ${removedUser.displayName} from all voice channels`)
        user.addRole(muteRole)
          .then(updated => {
            const response = `Successfully muted “${updated.displayName}”`
            console.log(response)
            discordUtils.embedResponse(message, {
              color: 'ORANGE',
              description: response
            })
          })
      })
      .catch(error => {
        console.error(error)
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: 'Oops! Something went wrong!'
        })
      })
  }
}
