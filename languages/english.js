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
      ERR_MISSING_BOT_PERMS: (user, perms) => `**${user}** I don't have the proper permissions for this command. Please give me the following permissions: ${perms}`
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
