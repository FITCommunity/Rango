import { ADMINISTRATOR, MODERATOR, EVERYONE } from "../../constants/roles";
import { ROLE } from "../../constants/permissionTypes";
import { getRole, getGuild } from "../../utils";
import { CommandPermission, ISlashCommand } from "../command";
import {
  CommandInteraction,
  Client,
  TextChannel,
  Guild,
  SlashCommandBuilder
} from "discord.js";

class EchoCommand implements ISlashCommand {
  data = new SlashCommandBuilder()
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
    )
    .toJSON();
  async execute(interaction: CommandInteraction): Promise<void> {
    const messageOption = interaction.options.get("message");
    const channelOption = interaction.options.get("channel");

    if (!channelOption || !channelOption.channel || !messageOption) {
      await interaction.reply({ content: "Command Failed", ephemeral: true });
      return;
    }

    const channel = channelOption.channel as TextChannel;
    await channel.send({
      content: messageOption.value as string
    });

    await interaction.reply({
      content: "Success"
    });
  }
  async getPermissions(client: Client<boolean>): Promise<CommandPermission[]> {
    const guild = await getGuild(
      client,
      process.env.DISCORD_GUILD_NAME as string
    );
    const roles = [
      { name: ADMINISTRATOR, permission: true },
      { name: MODERATOR, permission: true },
      { name: EVERYONE, permission: false }
    ];
    return roles.map((role) => ({
      type: ROLE,
      permission: role.permission,
      id: getRole(guild as Guild, role.name)?.id as string
    }));
  }
}

const echoCommand = new EchoCommand();
export default echoCommand;
