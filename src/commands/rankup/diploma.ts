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
  TRECA_GODINA,
  CETVRTA_GODINA,
  ALUMNI,
  REGISTROVAN,
  EVERYONE
} from "../../constants/roles";
import { ROLE } from "../../constants/permissionTypes";
import { GOLD } from "../../constants/colors";
import {
  getRole,
  getGuild,
  getMemberRankedRoles,
  memberHasRole,
  hasRoleResponse
} from "../../utils";
import { CommandPermission, ISlashCommand } from "../command";

class DiplomaCommand implements ISlashCommand {
  data = new SlashCommandBuilder()
    .setName("diploma")
    .setDescription("Diploma!")
    .toJSON();
  async execute(interaction: CommandInteraction): Promise<void> {
    const member = interaction.member as GuildMember;

    if (memberHasRole(member, REGISTROVAN)) {
      await interaction.reply(hasRoleResponse);
      return;
    }

    const memberRankedRoles = getMemberRankedRoles(member);

    for await (const memberRankedRole of memberRankedRoles) {
      await member.roles.remove(memberRankedRole);
    }

    const alumniRole = getRole(interaction.guild as Guild, ALUMNI) as Role;

    await member.roles.add(alumniRole);

    const emoji = ":mortar_board:";
    const embed = new EmbedBuilder()
      .setColor(GOLD)
      .setDescription(`${emoji} ${member.user.toString()} je alumni ${emoji}`)
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
      { name: TRECA_GODINA, permission: true },
      { name: CETVRTA_GODINA, permission: true },
      { name: EVERYONE, permission: false }
    ];
    return roles.map((role) => ({
      type: ROLE,
      permission: role.permission,
      id: getRole(guild as Guild, role.name)?.id as string
    }));
  }
}

const diplomaCommand = new DiplomaCommand();
export default diplomaCommand;
