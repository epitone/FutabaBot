const { Command } = require('discord.js-commando')
const { exec } = require('child_process')

module.exports = class TemplateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'exec',
      aliases: ['aliases', 'go', 'here'],
      group: 'admin',
      memberName: 'exec',
      description: 'Runs the specified shell commands and returns the output.',
      ownerOnly: true,
      args: [
        {
          key: 'command',
          prompt: 'Please enter the shell command.',
          type: 'string'
        }
      ]
    })
  }

  run (message, { command }) {
    exec('ls -la | head -n 35', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      const response = `\`\`\`
      ${stdout}
      \`\`\``
      message.channel.send(response)
      console.log(`stdout: ${stdout}`)
    })
  }
}
