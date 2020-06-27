const lang = process.env.lang

module.exports = class {
  constructor () {
    this.language = {
      UTILS: {
        STATUS: {
          dnd: 'Do not disturb',
          idle: 'AFK (idle)',
          offline: 'Disconnected',
          online: 'Online'
        }
      },
      NOT_IN_VOICE_CHANNEL: 'You need to be in a voice channel on this server to run this command.',
      EMPTY_SONG_QUEUE: 'It doesn\'t look like there are any songs in the queue.',
      ERR_MISSING_BOT_PERMS: (user, perms) => `**${user}** I don't have the proper permissions for this command. Please give me the following permissions: \`${perms}\``,
      ERR_GENERIC: 'Oops! Something went wrong!',
      ERR_SONG_NOT_FOUND: 'I couldn’t get data for that song! Try another link maybe?',
      MISSING_ROLE: (user) => `${user.tag} does not have that role!`,
      REMOVED_ROLE: (user, role) => `Successfully removed “${role.name}” from ${user.tag}`,
      SONG_ADDED_NO_PLAYBACK: (prefix) => `A song has been queued but the player is stopped. To start playback use the \`${prefix}play\` command.`,
      ROLE_HOIST: (hoisted) => hoisted ? 'Role hoisted' : 'Role un-hoisted.',
      ROLE_HIERARCHY_ERROR: 'That role is higher than mine - you\'ll need someone to adjust my role position for me to do this!',
      REMOVE_ROLES_SUCCESS: (user) => `Successfully removed all roles from ${user.tag}`
    }
  }
  /**
   * The method to get language strings
   * @param {string} term The string or function to look up
   * @param {...*} args Any arguments to pass to the lookup
   * @returns {string|Function}
   */

  get (term, ...args) {
    // if (!this.enabled && this !== this.store.default) return this.store.default.get(term, ...args);
    const value = this.language[term]
    /* eslint-disable new-cap */
    switch (typeof value) {
      case 'function': return value(...args)
      default: return value
    }
  }

  getLang () {
    return lang
  }
}