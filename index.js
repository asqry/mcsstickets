const TManager = require("./Managers/TicketManager")
const TicketBot = require("./Structures/TicketBot")
const TMessageManager = (require("./Managers/TicketMessageManager"))


const client = new TicketBot()
const TicketMessageManager = new TMessageManager(client)

client.init()

client.on("ready", async() => {
    TicketMessageManager.run()

    console.log("ready!")
})

client.on('message', async message => {
  if (message.author.bot || message.system) return;
  if (!message.member && message.guild) message.member = await message.guild.members.fetch(message.author);

  if(!message.content.startsWith(client.config.Prefix)) return;

  const args = message.content.slice(client.config.Prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase()

  let c = client.commands.get(cmd)
  if(!c || c == null) return;

  const command = new c()

    if (!command) return;

    command.run(client, message, args)
})

process.on('rejectionHandled', (err) => {
  console.error(err);
});

process.on('unhandledRejection', (err) => {
  console.error(err);
});

process.on('uncaughtException', (err) => {
  console.error(err);
});