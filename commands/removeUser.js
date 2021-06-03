const config = require("../config")
const Command = require("../Structures/Command")

class Remove extends Command {
    constructor(client) {
        super(client, {
            name: 'remove',
        })
        this.TicketCategory = config.TicketCategory
        this.ClosingLogs = config.ClosingLogsChannel
    }
    
    async run(client, message, args){
        const TicketManager = new (require('../Managers/TicketManager'))(client)

        if(message.channel) message.delete()
        if(message.channel.parent.id != this.TicketCategory || message.channel.id == this.ClosingLogs) return message.reply(`You can't use this command outside of ticket channels.`).then(m => m.delete({timeout:3000}))
        const RemoveTarget = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
        if(!RemoveTarget) return message.reply('Please @ a user to remove from this ticket.').then((m) => m.delete({ timeout: 3000 }));

        TicketManager.removeUserFromTicket(message.channel, RemoveTarget, message.member)
    }
}

module.exports = Remove