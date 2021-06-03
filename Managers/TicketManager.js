const { CategoryChannel, Permissions } = require("discord.js");
const config = require("../config")
const Embed = require('./EmbedManager');
const fs = require("fs")
const glob = require("glob")

class TicketManager {
  constructor(client) {
    this.client = client;
    this.support = config.SupportRoles;
    this.message = config.NewTicketMessage;
    this.footer = config.NewTicketFooter;
    this.category = config.TicketCategory;
    this.guild = config.Guild;
    this.colors = config.colors;
    this.logs = config.ClosingLogsChannel;
    this.logsMessage = config.ClosingTicketLogsDescription;
    this.addedMessage = config.AddedToTicketDescription;
    this.removedMessage = config.RemovedFromTicketDescription;
    this.ListenerManager = new (require("../Managers/ListenerManager"))(client)
  }

  async TicketDoesExist(user) {
    const GetExistingTicketList = this.client.channels.cache
      .array()
      .filter((x) => x.parent == this.category);
    const ExistingTicketString = GetExistingTicketList.map((x) => x.name).join(
      ''
    );
    if (ExistingTicketString.match(new RegExp(user.id, 'gmi'))) return true;

    return false;
  }

  async createTicket(user) {
    const client = this.client;

    const TicketCategory = client.channels.cache.get(this.category);
    if (!(TicketCategory instanceof CategoryChannel))
      throw new Error(
        'Ticket category channel is not the correct type. Expected category type but got ' +
          TicketCategory.type
      );

    const GetTicketDoesExist = await this.TicketDoesExist(user);

    if (GetTicketDoesExist) return;

    const Guild = client.guilds.cache.get(this.guild);
    const NewTicketChannel = await Guild.channels.create(
      `${user.tag}-${user.id}`,
      { type: 'text', parent: TicketCategory.id }
    );

    const NewTicketEmbed = new Embed({
      color: this.colors.yellow,
      description: this.message,
      footer: this.footer,
    });

    this.ListenerManager.attachTranscriptListener(
      NewTicketChannel,
      (m) => !m.content.startsWith('!')
    );

    //Create the transcript file
      fs.open(`./Transcripts/${NewTicketChannel.id}.txt`, 'w', () => {})
    //Create the transcript file

    await NewTicketChannel.send(
      this.support.map((x) => '<@&' + x + '>').join(' '),
      NewTicketEmbed
    );
    this.addUserToTicket(
      NewTicketChannel,
      Guild.member(user),
      Guild.member(client.user)
    );
  }

  async closeTicket(Ticket, closer) {
    const client = this.client;

    const TicketCloseLogEmbed = new Embed({
      title: 'Ticket Closed',
      timestamp: true,
      color: this.colors.red,
      description: `${this.logsMessage
        .replace(/\{ticket\}/, `**\`#${Ticket.name}\`**`)
        .replace(/\{closer\}/, `${closer}`)}`,
    });
    const TicketCloseLogChannel = client.channels.cache.get(this.logs);

    fs.appendFile(`./Transcripts/${Ticket.id}.txt`, `\n\n[Ticket Closed by ${closer.user.tag} at ${(new Date()).toString()}]`, () => {})
    TicketCloseLogChannel.send({embed: TicketCloseLogEmbed, files: [{name: `${Ticket.name}.txt`, attachment: fs.readFileSync(`./Transcripts/${Ticket.id}.txt`)}]})
    Ticket.delete();

    
  }

  async addUserToTicket(Ticket, user, adder) {
    await Ticket.updateOverwrite(
      user,
      {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
      },
      `Added ${user.user.tag} to the ticket #${Ticket.name}`
    );

    const AddedUserEmbed = new Embed({
      color: this.colors.green,
      description: `${this.addedMessage
        .replace(/\{user\}/, `${user}`)
        .replace(/\{adder\}/, `${adder}`)}`,
    });

    await Ticket.send(AddedUserEmbed);
  }

  async removeUserFromTicket(Ticket, user, remover) {
    await Ticket.updateOverwrite(
      user,
      {
        VIEW_CHANNEL: false
      },
      `Removed ${user.user.tag} from the ticket #${Ticket.name}`
    );

    const RemovedUserEmbed = new Embed({
      color: this.colors.red,
      description: `${this.removedMessage
        .replace(/\{user\}/, `${user}`)
        .replace(/\{remover\}/, `${remover}`)}`,
    });

    await Ticket.send(RemovedUserEmbed);
  }
}

module.exports = TicketManager