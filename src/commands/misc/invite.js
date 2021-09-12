const { SlashCommandBuilder } = require("@discordjs/builders");
const { getTextChannel } = require("../../utils");
const { LOBBY } = require("../../constants/channels");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Creates an invite"),
  async execute(interaction) {
    const channel = await getTextChannel(interaction.guild, LOBBY);
    const invite = await channel.createInvite({
      maxAge: 24 * 2 * 60 * 60,
      maxUses: 1,
      unique: true,
      reason: `Created by ${interaction.member.displayName}`
    });

    const memberDM = await interaction.member.createDM();
    await memberDM.send(invite.url);

    await interaction.reply(":e_mail:");
  }
};
