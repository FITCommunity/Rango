import { getTextChannel } from "../../utils/channel";
import { LOBBY } from "../../constants/channels";
import {
  Client,
  CommandInteraction,
  Guild,
  GuildMember,
  SlashCommandBuilder,
  TextChannel
} from "discord.js";
import { CommandPermission, ISlashCommand } from "../command";

class InviteCommand implements ISlashCommand {
  data = new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Creates an invite")
    .toJSON();
  async execute(interaction: CommandInteraction): Promise<void> {
    const channel = (await getTextChannel(
      interaction.guild as Guild,
      LOBBY
    )) as TextChannel;

    const member = interaction.member as GuildMember;

    const invite = await channel.createInvite({
      maxAge: 24 * 2 * 60 * 60,
      maxUses: 1,
      unique: true,
      reason: `Created by ${member.displayName}`
    });

    const memberDM = await member.createDM();
    await memberDM.send(invite.url);

    await interaction.reply(":e_mail:");
  }
  async getPermissions(client: Client<boolean>): Promise<CommandPermission[]> {
    const permissions: CommandPermission[] = [];
    return Promise.resolve(permissions);
  }
}

const inviteCommand = new InviteCommand();
export default inviteCommand;
