import {
  Client,
  CommandInteraction,
  Guild,
  GuildMember,
  SlashCommandBuilder,
  EmbedBuilder,
  Role
} from "discord.js";
import {
  EVERYONE,
  MUTED,
  ADMINISTRATOR,
  MODERATOR
} from "../../constants/roles";
import { ROLE } from "../../constants/permissionTypes";
import { GREEN } from "../../constants/colors";
import { getRole, getGuild } from "../../utils";
import { CommandPermission, ISlashCommand } from "../command";
import User from "../../database/models/user";

class AddMemberCommand implements ISlashCommand {
  data = new SlashCommandBuilder()
    .setName("add-member")
    .setDescription("Add member to the database!")
    .addMentionableOption((option) =>
      option.setName("member").setDescription("Target Member").setRequired(true)
    )
    .addStringOption((option) => option.setName("index").setRequired(true))
    .toJSON();
  async execute(interaction: CommandInteraction): Promise<void> {
    const memberOption = interaction.options.get("member");
    const member = memberOption?.member as GuildMember;

    const index = interaction.options.get("index")?.value as string;

    await User.create({
      Index: index,
      DiscordId: member.id,
      Discriminator: member.user.discriminator,
      Username: member.user.username,
      Name: member.nickname ?? member.user.username
    });

    const embed = new EmbedBuilder()
      .setColor(GREEN)
      .setDescription(`Member ${member.nickname} added!`);

    await interaction.reply({
      embeds: [embed]
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

const addMemberCommand = new AddMemberCommand();
export default addMemberCommand;
