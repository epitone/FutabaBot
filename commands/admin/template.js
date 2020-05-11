// const { Command } = require('discord.js-commando');

// module.exports = class TemplateCommand extends Command {
//   constructor (client) {
//     super(client, {
//       name: 'command-name',
//       aliases: ['array', 'of', 'aliases'],
//       group: 'groupName', //the command group the command is a part of.
//       memberName: 'memberName', //the name of the command within the group (this can be different from the name).
//       description: 'command description',
//       args: [
//         {
//           key: 'name_of_argument',
//           prompt: 'text-to-display-if-no-argument-provided',
//           type: 'data-type-of-argument',
//           default: 'default-argument-value', // if no argument is given, this is the default
//           validate: name_of_argument => { } // validate the argument
//         }
//       ]
//     });
//   }

//   run (message, { name_of_argument }) {
//     /// do stuff here
//   }
// }
