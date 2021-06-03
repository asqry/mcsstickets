const config = require("../config")
const Command = require("../Structures/Command")

class Add extends Command {
    constructor(client) {
        super(client, {
            name: 'add',
        })
        this.TicketCategory = config.TicketCategory
        this.ClosingLogs = config.ClosingLogsChannel
    }
    
    async run(client, message, args){
        const TicketManager = new (require('../Managers/TicketManager'))(client)

        if(message.channel) message.delete()
        if(message.channel.parent.id != this.TicketCategory || message.channel.id == this.ClosingLogs) return message.reply(`You can't use this command outside of ticket channels.`).then(m => m.delete({timeout:3000}))
        const AddTarget = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
        if(!AddTarget) return message.reply('Please @ a user to add to this ticket.').then((m) => m.delete({ timeout: 3000 }));

        TicketManager.addUserToTicket(message.channel, AddTarget, message.member)
    }
}

module.exports = Add