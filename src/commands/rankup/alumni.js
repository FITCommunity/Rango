const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  TRECA_GODINA,
  CETVRTA_GODINA,
  ALUMNI,
  REGISTROVAN,
  EVERYONE
} = require("../../constants/roles");
const { ROLE } = require("../../constants/permissionTypes");
const { GOLD } = require("../../constants/colors");
const {
  getRole,
  getGuild,
  getMemberRankedRoles,
  memberHasRole,
  hasRoleResponse
} = require("../../utils");

module.exports = {
  data: new SlashCommandBuilder().setName("alumni").setDescription("Diploma!"),
  async execute(interaction) {
    const { member } = interaction;

    if (memberHasRole(member, REGISTROVAN)) {
      await interaction.reply(hasRoleResponse);
      return;
    }

    const memberRankedRoles = getMemberRankedRoles(member);

    for await (const memberRankedRole of memberRankedRoles) {
      await member.roles.remove(memberRankedRole);
    }

    const alumniRole = getRole(interaction.guild, ALUMNI);

    await member.roles.add(alumniRole);

    const emoji = ":mortar_board:";
    const embed = new MessageEmbed()
      .setColor(GOLD)
      .setDescription(`${emoji} ${member.user.toString()} je alumni ${emoji}`)
      .setAuthor(member.displayName, member.user.avatarURL());

    await interaction.reply({
      embeds: [embed]
    });
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
