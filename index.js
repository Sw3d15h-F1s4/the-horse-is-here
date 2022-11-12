const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");

const fs = require('node:fs');
const path = require('node:path');


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at "${filePath}" is missing properties.`);
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`[ERROR] Command "${interaction.commandName}" not found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`[ERROR] ${error}`)
    await interaction.reply({ content: 'Error during command execution!', ephemeral: true });
  }
});



client.once(Events.ClientReady, c => {
  console.log(`logged in as ${client.user.tag}!`);
});


client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;
  if (message.content.includes("hungry")){
    message.reply({ files: ["./images/horse_distress.png"] });
    
  }
});



const updateCommands = false;
const localOnly = false;

if (updateCommands) {
  const { REST, Routes } = require('discord.js');
  const commandsList = [];
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commandsList.push(command.data.toJSON());
  }
  const rest = new REST({ version: '10' }).setToken(process.env['TOKEN']);
  (async () => {
    try {
      console.log(`Started refreshing ${commandsList.length} application (/) commands.`);

      if (localOnly) {
        const data = await rest.put(
          Routes.applicationGuildCommands(process.env['clientId'], process.env['guildId']),
          { body: commandsList },
        );
      } else {
        const data = await rest.put(
          Routes.applicationCommands(process.env['clientId']),
          { body: commandsList },
        );
      }
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  })();
}













client.login(process.env['TOKEN']);
