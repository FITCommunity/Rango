const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ADMINISTRATOR, MODERATOR, EVERYONE } = require("../../constants/roles");
const { ROLE } = require("../../constants/permissionTypes");
const { BLACK } = require("../../constants/colors");
const { getRole, getGuild } = require("../../utils");
const { Users } = require("../../models");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("student")
    .setDescription("Vraca informacije o studentu")
    .addStringOption((option) =>
      option
        .setName("index")
        .setDescription("Broj indeksa studenta")
        .setRequired(true)
    ),
  async execute(interaction) {
    const indexOption = interaction.options.get("index");

    const user = await Users.findOne({ where: { Index: indexOption.value } });

    console.log(user);
    const embed = new MessageEmbed()
      .setColor(BLACK)
      .setDescription(`${user.Name}`);

    await interaction.reply({
      embeds: [embed]
    });
  },
  async getPermissions(client) {
    const guild = await getGuild(client, process.env.GUILD_NAME);
    const roles = [
      { name: ADMINISTRATOR, permission: true },
      { name: MODERATOR, permission: true },
      { name: EVERYONE, permission: false }
    ];
    return roles.map((role) => ({
      type: ROLE,
      permission: role.permission,
      id: getRole(guild, role.name).id
    }));
  }
};
