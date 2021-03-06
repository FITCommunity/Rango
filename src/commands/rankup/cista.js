const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  PRVA_GODINA,
  DRUGA_GODINA,
  TRECA_GODINA,
  REGISTROVAN,
  EVERYONE
} = require("../../constants/roles");
const { ROLE } = require("../../constants/permissionTypes");
const { GOLD } = require("../../constants/colors");
const {
  getRole,
  getGuild,
  getMemberRankedRoles,
  getHighestRankedRole,
  getNextRankedRole,
  memberHasRole,
  hasRoleResponse
} = require("../../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cista")
    .setDescription("Ociscena godina!"),
  async execute(interaction) {
    const { member } = interaction;

    if (memberHasRole(member, REGISTROVAN)) {
      await interaction.reply(hasRoleResponse);
      return;
    }

    const highestRole = getHighestRankedRole(member);
    const memberRankedRoles = getMemberRankedRoles(member);

    for await (const memberRankedRole of memberRankedRoles) {
      await member.roles.remove(memberRankedRole);
    }

    const registrovanRole = getRole(interaction.guild, REGISTROVAN);
    const nextRole = getRole(interaction.guild, getNextRankedRole(highestRole));

    await member.roles.add(registrovanRole);
    await member.roles.add(nextRole);

    const emoji = ":tada:";
    const embed = new MessageEmbed()
      .setColor(GOLD)
      .setDescription(
        `${emoji} ${member.user.toString()} je ocistio/ocistila ${emoji}`
      )
      .setAuthor(member.displayName, member.user.avatarURL());

    await interaction.reply({
      embeds: [embed]
    });
  },
  async getPermissions(client) {
    const guild = await getGuild(client, process.env.DISCORD_GUILD_NAME);
    const roles = [
      { name: PRVA_GODINA, permission: true },
      { name: DRUGA_GODINA, permission: true },
      { name: TRECA_GODINA, permission: true },
      { name: EVERYONE, permission: false }
    ];
    return roles.map((role) => ({
      type: ROLE,
      permission: role.permission,
      id: getRole(guild, role.name).id
    }));
  }
};
