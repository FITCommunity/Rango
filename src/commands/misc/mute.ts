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
  import { BLACK, GOLD } from "../../constants/colors";
  import {
    getRole,
    getGuild
  } from "../../utils";
  import { CommandPermission, ISlashCommand } from "../command";
  
  class MuteCommand implements ISlashCommand {
    data = new SlashCommandBuilder()
      .setName("mute")
      .setDescription("This mutes a member!")
      .addMentionableOption((option)=>option.setName("member").setDescription("Target Member").setRequired(true))
      .toJSON();
    async execute(interaction: CommandInteraction): Promise<void> {
      const memberOption=interaction.options.get("member");
      const member = memberOption?.member as GuildMember;
  
      const mutedRole = getRole(interaction.guild as Guild, MUTED) as Role;
  
      await member.roles.add(mutedRole);
  
      const embed = new EmbedBuilder()
        .setColor(BLACK)
        .setAuthor({
          name: member.displayName,
          iconURL: member.user.avatarURL() as string
        });
  
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
  
  const mutedCommand = new MuteCommand();
  export default mutedCommand;