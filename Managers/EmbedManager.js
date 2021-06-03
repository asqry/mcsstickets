const {MessageEmbed} = require("discord.js")

class EmbedManager {
    constructor(options){
        this.title = options.title || null;
        this.description = options.description || null;
        this.fields = options.fields || null;
        this.color = options.color || null;
        this.footer = options.footer || null;
        this.timestamp = options.timestamp || false;

        if (!this.color || this.color == null)
          throw new Error('Color is a required field in an Embed.');

        let embed = new MessageEmbed().setColor(this.color);

        if (this.description || this.description !== null)
          embed.setDescription(this.description.toString());
        if (this.title || this.title !== null)
          embed.setTitle(this.title.toString());
        if (this.footer || this.footer !== null)
          embed.setFooter(this.footer.toString());
          if(this.fields || this.fields !== null)
            embed.addFields(...fields)
          if(this.timestamp) embed.setTimestamp()

        return embed;
    }

        
}

module.exports = EmbedManager