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
      AAR_SUCCESS: (user, role) => `**${user.tag}** Successfully set the auto-assign role to ${role}. Everyone who joins the server will now have this role.`,
      AVATAR_SET_SUCCESS: 'Successfully updated avatar.',
      BOT_STATUS_SUCCESS: (status) => `My status is now: **${status}**`,
      EMPTY_SONG_QUEUE: 'It doesn’t look like there are any songs in the queue.',
      ERR_MISSING_BOT_PERMS: (user, perms) => `**${user.tag}** I don't have the proper permissions for this command. Please give me the following permissions: \`${perms}\``,
      ERR_GENERIC: 'Oops! Something went wrong!',
      ERR_GUILD_NOT_FOUND: 'I couldn’t find a guild with that information.',
      ERR_SONG_NOT_FOUND: 'I couldn’t get data for that song! Try another link maybe?',
      GOODBYE_TIMEOUT_MSG: (timeout) => `Goodbye messages will ${timeout > 0 ? `be deleted after ${timeout} ${timeout > 1 ? 'seconds.' : 'second.'}` : 'not be deleted.'}`,
      GREETING_MESSAGE_ERR: 'Those two welcome messages are the same!',
      GREETING_MESSAGE_NOT_FOUND: 'This server has no welcome message',
      GREETING_MESSAGE_RESPONSE: (message, embedEnabled) => `Server greeting message: “${message}” (embed enabled: ${embedEnabled})`,
      GREETING_TIMEOUT_MSG: (timeout) => `Greeting messages will ${timeout > 0 ? `be deleted after  ${timeout} ${timeout > 1 ? 'seconds.' : 'second.'} .` : 'not be deleted.'}`,
      INSUFFICIENT_PERMISSIONS: (user) => `**${user.tag}** you don’t have permission to execute this command!`,
      INVALID_COLOR: 'You entered an invalid color code.',
      INVALID_PATH: 'You entered an invalid path or url - please try again.',
      LEAVING_MESSAGE_ERR: 'Those two goodbye messages are the same!',
      LEAVING_MESSAGE_NOT_FOUND: 'This server has no goodbye message',
      LEAVING_MESSAGE_RESPONSE: (message, embedEnabled) => `Server goodbye message: “${message}” (embed enabled: ${embedEnabled})`,
      LOG_CHANNEL_ADDED: (channel) => `Added ${channel} to logignore list`,
      LOG_CHANNEL_REMOVED: (channel) => `Removed ${channel} from logignore list`,
      LOG_EVENT_SET: (logEvent) => `Started logging **${logEvent}** in this channel.`,
      LOG_SERVER_SET: 'Successfully enabled log server.',
      MISSING_ROLE: (user) => `${user.tag} does not have that role!`,
      NOT_IN_VOICE_CHANNEL: 'You need to be in a voice channel on this server to run this command.',
      REMOVE_ROLES_SUCCESS: (user) => `Successfully removed all roles from ${user.tag}`,
      REMOVED_ROLE: (user, role) => `Successfully removed “${role.name}” from ${user.tag}`,
      ROLE_COLOR_UPDATE: 'Role color updated',
      ROLE_HIERARCHY_ERROR: 'That role is higher than mine - you’ll need someone to adjust my role position for me to do this!',
      ROLE_HOIST: (hoisted) => hoisted ? 'Role hoisted' : 'Role un-hoisted.',
      SONG_ADDED_NO_PLAYBACK: (prefix) => `A song has been queued but the player is stopped. To start playback use the \`${prefix}play\` command.`,
      UPDATE_PLAYING_ERR: 'Those two statuses are the same!',
      UPDATE_PLAYING_SUCCESS: (playingStatus) => `Successfully updated my status to: ${playingStatus}`,
      USER_ROLE_HIERARCHY_ERROR: (user) => `**${user.tag}** That role is higher than your highest role!`
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
