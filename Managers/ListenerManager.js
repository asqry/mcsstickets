const { MessageCollector, Util } = require("discord.js")
const fs = require("fs"),
glob = require("glob"),
path = require("path")

class ListenerManager {
  constructor(client) {
    this.client = client;
  }

  get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  async getTranscriptFile(Ticket) {
    fs.readFile(`./Transcripts/${Ticket}.txt`, file => {
        if(!file) return false

        return true
    })


  }

  async attachTranscriptListener(channel, filter, options = {}) {
      
      let Collector = await channel.createMessageCollector(filter, options);
      
      Collector.on('collect', async (m) => {
          if(m.embeds.length > 0 && m.embeds.length < 2) return fs.appendFile(`./Transcripts/${m.channel.id}.txt`, `${m.author.tag} -> [EMBED]\n\n`, () => {});
        fs.appendFile(
          `./Transcripts/${m.channel.id}.txt`,`${m.author.tag} -> ${Util.cleanContent(m.content, m)}\n\n`,
          () => {}
        );  
      
    });

    return Collector;
  }
}

module.exports = ListenerManager