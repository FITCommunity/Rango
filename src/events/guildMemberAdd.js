const { MessageEmbed } = require("discord.js");
const { getTextChannel, getRole } = require("../utils");
const { LOGGER } = require("../constants/channels");
const { GREEN } = require("../constants/colors");
const { NEREGISTROVAN } = require("../constants/roles");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const { guild } = member;
    const embed = new MessageEmbed()
      .setColor(GREEN)
      .setTitle("Member Joined")
      .setDescription(member.user.toString())
      .addField("Created", member.user.createdAt.toString(), true)
      .addField("Joined", member.joinedAt.toString(), true)
      .setAuthor(member.displayName, member.user.avatarURL())
      .setTimestamp()
      .setFooter(guild.name, guild.iconURL());

    const channel = await getTextChannel(guild, LOGGER);
    await channel.send({ embeds: [embed] });

    const role = getRole(member.guild, NEREGISTROVAN);
    member.roles.add(role);
  }
};
