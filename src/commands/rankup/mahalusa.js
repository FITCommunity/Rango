const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REGISTROVAN, EVERYONE } = require("../../constants/roles");
const { ROLE } = require("../../constants/permissionTypes");
const { BLACK } = require("../../constants/colors");
const {
  getRole,
  getGuild,
  getMemberRankedRoles,
  getHighestRankedRole
} = require("../../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mahalusa")
    .setDescription("Uklanja uloge za prethodne godine"),
  async execute(interaction) {
    const { member } = interaction;

    const memberRankedRoles = getMemberRankedRoles(member);

    if (memberRankedRoles.length <= 1) {
      return;
    }

    const highestRole = getHighestRankedRole(member);

    for await (const memberRankedRole of memberRankedRoles) {
      if (memberRankedRole.name !== highestRole.name) {
        await member.roles.remove(memberRankedRole);
      }
    }

    const emoji = ":broom:";
    const embed = new MessageEmbed()
      .setColor(BLACK)
      .setDescription(
        `${emoji} ${member.user.toString()} NE MAHALAJ!!! ${emoji}`
      )
      .setAuthor(member.displayName, member.user.avatarURL());

    await interaction.reply({
      embeds: [embed]
    });
  },
  async getPermissions(client) {
    const guild = await getGuild(client, process.env.DISCORD_GUILD_NAME);
    const roles = [
      { name: REGISTROVAN, permission: true },
      { name: EVERYONE, permission: false }
    ];
    return roles.map((role) => ({
      type: ROLE,
      permission: role.permission,
      id: getRole(guild, role.name).id
    }));
  }
};
