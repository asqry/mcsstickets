const { Client, Collection } = require('discord.js'),
  path = require('path'),
  glob = require("glob");
  const fs = require('fs')
require('dotenv/config');

class TicketBot extends Client {
  constructor(options = {partials: ['REACTION']}) {
    super(options);

    this.config = require('../config.js');
    this.commands = new Collection();
    this.event = new Collection();
    this.aliases = new Collection();

    console.log('Client Initialized <3');
  }

  loadCommands() {
    const files = fs
      .readdirSync('./commands')
      .filter((file) => file.endsWith('.js'));

    for (const file of files) {
      const cmd = require('../commands/' + file);

      if (!cmd || !cmd.name) return;

      this.commands.set(cmd.name.toLowerCase(), cmd);

      if (cmd.aliases && Array.isArray(cmd.aliases))
        cmd.aliases.forEach((alias) => this.aliases.set(alias, cmd.name));

      console.log(`Loaded - ${file}`);
    }
  }

  

  async login() {
    if (!process.env.TOKEN) throw new Error('No token provided');

    await super.login(process.env.TOKEN);
  }

  init() {
    this.loadCommands();
    this.login();
  }
}

module.exports = TicketBot;
