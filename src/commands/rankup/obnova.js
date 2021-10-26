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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("obnova")
    .setDescription("Obnova")
    .addBooleanOption((option) =>
      option
        .setName("ukloni-prethodne-godine")
        .setDescription("Uklanja uloge za prethodne godine")
        .setRequired(true)
    ),
  async execute(interaction) {
    const ukloniPrethodneGodineOption = interaction.options.get(
      "ukloni-prethodne-godine"
    ).value;

    const { member } = interaction;

    if (memberHasRole(member, REGISTROVAN)) {
      await interaction.reply(hasRoleResponse);
      return;
    }

    const highestRole = getHighestRankedRole(member);
    const memberRankedRoles = getMemberRankedRoles(member);

    if (ukloniPrethodneGodineOption) {
      for await (const memberRankedRole of memberRankedRoles) {
        if (memberRankedRole.name !== highestRole.name) {
          await member.roles.remove(memberRankedRole);
        }
      }
    }

    const registrovanRole = getRole(interaction.guild, REGISTROVAN);

    await member.roles.add(registrovanRole);

    const emoji = ":face_with_symbols_over_mouth:";
    const embed = new MessageEmbed()
      .setColor(GOLD)
      .setDescription(
        `${emoji} ${member.user.toString()} je obnovio/obnovila ${emoji}`
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
