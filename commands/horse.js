const { SlashCommandBuilder } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName('horse')
    .setDescription('peetah, the horse is here'),
  async execute(interaction) {
    await interaction.reply({ files: ["./images/horse.png"] });
  },
};
