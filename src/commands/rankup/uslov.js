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
  memberHasRole,
  hasRoleResponse
} = require("../../utils");
const { rankedRoles } = require("../../constants/rankedRoles");

module.exports = {
  data: new SlashCommandBuilder().setName("uslov").setDescription("Uslov!"),
  async execute(interaction) {
    const {member} = interaction;

    if (memberHasRole(member, REGISTROVAN)) {
      await interaction.reply(hasRoleResponse);
      return;
    }

    const highestRole = getHighestRankedRole(member);
    const memberRankedRoles = getMemberRankedRoles(member);

    /* eslint-disable no-await-in-loop */
    for (const memberRankedRole of memberRankedRoles) {
      if (memberRankedRole.name !== highestRole.name) {
        await member.roles.remove(memberRankedRole);
      }
    }
    /* eslint-enable no-await-in-loop */

    const registrovanRole = getRole(interaction.guild, REGISTROVAN);
    const nextRole = getRole(
      interaction.guild,
      rankedRoles[highestRole.name].Next
    );

    await member.roles.add(registrovanRole);
    await member.roles.add(nextRole);

    const emoji = ":tada:";
    const embed = new MessageEmbed()
      .setColor(GOLD)
      .setDescription(
        `${emoji} ${member.user.toString()} je ispunio/ispunila uslov ${emoji}`
      )
      .setAuthor(member.displayName, member.user.avatarURL());

    await interaction.reply({
      embeds: [embed]
    });
  },
  async getPermissions(client) {
    const guild = await getGuild(client, process.env.GUILD_NAME);
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
