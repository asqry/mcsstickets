const { Permissions } = require('discord.js');

class Command {
  constructor(client, options = {}) {
    this.client = client;

    this.name = options.name || null;
    this.aliases = options.aliases || [];
    this.description = options.description || 'No information specified.';
  }

  async run() {
    throw new Error(`Command ${this.name} doesn't provide a run method!`);
  }
}

module.exports = Command;
