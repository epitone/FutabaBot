const { Command } = require('discord.js-commando');

module.exports = class AutoAssignRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'autoassignrole',
      aliases: ['aar'],
      group: 'admin', //the command group the command is a part of.
      memberName: 'autoassignrole', //the name of the command within the group (this can be different from the name).
      description: 'Automaticaly assigns a specified role to every user who joins the server. Provide no parameters to disable.',
      args: [
        {
          key: 'role',
          prompt: 'What role would you like to assign? (Leave blank to disable this feature)',
          type: 'role',
          default: '' // if no argument is given, this is the default
        }
      ]
    })
  }

  run (message, { name_of_argument }) {
    /// do stuff here
  }
}
