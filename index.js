const Discord = require("discord.js");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}!`);
})

client.on("message", msg => {
  if (msg.content == "ping") {
    msg.reply("pong");
  }
})

client.login(process.env['TOKEN']);
