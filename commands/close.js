const config = require("../config")
const Command = require("../Structures/Command")

class Close extends Command {
    constructor(client) {
        super(client, {
            name: 'close',
        })
        this.TicketCategory = config.TicketCategory
        this.ClosingLogs = config.ClosingLogsChannel
    }
    
    async run(client, message, args){
        const TicketManager = new (require('../Managers/TicketManager'))(client)

        if(message.channel) message.delete()
        if(!message.channel.id || message.channel.parent.id != this.TicketCategory || message.channel.id == this.ClosingLogs) return message.reply(`You can't use this command outside of ticket channels.`).then(m => m.delete({timeout:5000}))
        TicketManager.closeTicket(message.channel, message.member)
    }
}

module.exports = Close