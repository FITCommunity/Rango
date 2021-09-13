const { SlashCommandBuilder } = require("@discordjs/builders");
const { ADMINISTRATOR, MODERATOR, EVERYONE } = require("../../constants/roles");
const { ROLE } = require("../../constants/permissionTypes");
const { getRole, getGuild } = require("../../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Post a message as a bot")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Target channel")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message to post")
        .setRequired(true)
    ),
  async execute(interaction) {
    const messageOption = interaction.options.get("message");
    const channelOption = interaction.options.get("channel");

    await channelOption.channel.send({
      content: messageOption.value
    });

    await interaction.reply({
      content: "Success"
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
