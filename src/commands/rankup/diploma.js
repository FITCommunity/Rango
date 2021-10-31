const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  TRECA_GODINA,
  CETVRTA_GODINA,
  EVERYONE
} = require("../../constants/roles");
const { ROLE } = require("../../constants/permissionTypes");
const { GOLD } = require("../../constants/colors");
const { getRole, getGuild } = require("../../utils");

module.exports = {
  data: new SlashCommandBuilder().setName("diploma").setDescription("Diploma!"),
  async execute(interaction) {
    const { member } = interaction;

    const emoji = ":mortar_board:";
    const embed = new MessageEmbed()
      .setColor(GOLD)
      .setDescription(
        `${emoji} ${member.user.toString()} je diplomirao/la ${emoji}`
      )
      .setAuthor(member.displayName, member.user.avatarURL());

    await interaction.reply({
      embeds: [embed]
    });

    await member.kick("Diplomirao/la");
  },
  async getPermissions(client) {
    const guild = await getGuild(client, process.env.DISCORD_GUILD_NAME);
    const roles = [
      { name: TRECA_GODINA, permission: true },
      { name: CETVRTA_GODINA, permission: true },
      { name: EVERYONE, permission: false }
    ];
    return roles.map((role) => ({
      type: ROLE,
      permission: role.permission,
      id: getRole(guild, role.name).id
    }));
  }
};
