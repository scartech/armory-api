/**
 * Client message
 * @typedef {object} ClientMessage
 * @property {boolean} error - Is this message due to an error
 * @property {array<string>} messages - Array of messages
 */
class ClientMessage {
  constructor(error, messages) {
    this.error = error;
    this.messages = messages;
  }
}

module.exports = ClientMessage;
