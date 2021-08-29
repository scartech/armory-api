class ClientMessage {
  constructor(error, messages) {
    this.error = error;
    this.messages = messages;
  }
}

module.exports = ClientMessage;
