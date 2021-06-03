const config = require("../config")
const Embed = require("./EmbedManager")
const TManager = require('./TicketManager')

const fs = require("fs")
require("discord.js")

class TicketMessageManager {
    constructor(client){
        this.client = client;
        this.channel = config.TicketMessageChannel
        this.message = config.TicketMessageMessage
        this.reaction = config.TicketMessageReaction
        this.colors = config.colors
        this.TicketManager = new TManager(client);
    }

    async run(){
        const client = this.client
        const TicketManager = this.TicketManager
        const TicketMessageChannel = client.channels.cache.get(this.channel)

        const OldTicketIDFile = JSON.parse(fs.readFileSync('./ticketID.json', 'utf8'))
        const OldTicketMessageID = OldTicketIDFile['id'];
        const OldTicketMessage = await TicketMessageChannel.messages.fetch(OldTicketMessageID ? OldTicketMessageID : null)

        if(OldTicketMessage != null) OldTicketMessage.delete()
        
        let TicketMessage = await TicketMessageChannel.send(
          new Embed({ color: this.colors.blue, description: this.message })
        );

        fs.writeFileSync("./ticketID.json", JSON.stringify({id: TicketMessage.id}))

        let TicketReactionFilter = (reaction, user) => !user.bot && reaction.emoji.name === this.reaction

        let TicketReactionOptions = {};

        await TicketMessage.react(this.reaction)
        let TicketReactionCollector = await TicketMessage.createReactionCollector(TicketReactionFilter, TicketReactionOptions)

        TicketReactionCollector.on("collect", (reaction, user) => {
            reaction.message.reactions.resolve(reaction.emoji.name).users.remove(user.id)

            TicketManager.createTicket(user)
        })
    }
}

module.exports = TicketMessageManager