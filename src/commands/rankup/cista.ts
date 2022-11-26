import {
  Client,
  CommandInteraction,
  Guild,
  GuildMember,
  EmbedBuilder,
  SlashCommandBuilder,
  Role
} from "discord.js";
import {
  PRVA_GODINA,
  DRUGA_GODINA,
  TRECA_GODINA,
  REGISTROVAN,
  EVERYONE
} from "../../constants/roles";
import { ROLE } from "../../constants/permissionTypes";
import { GOLD } from "../../constants/colors";
import {
  getRole,
  getGuild,
  getMemberRankedRoles,
  getHighestRankedRole,
  getNextRankedRole,
  memberHasRole,
  hasRoleResponse
} from "../../utils";
import { CommandPermission, ISlashCommand } from "../command";

class CistaCommand implements ISlashCommand {
  data = new SlashCommandBuilder()
    .setName("cista")
    .setDescription("Ociscena godina!")
    .toJSON();
  async execute(interaction: CommandInteraction): Promise<void> {
    const member = interaction.member as GuildMember;

    if (memberHasRole(member, REGISTROVAN)) {
      await interaction.reply(hasRoleResponse);
      return;
    }

    const highestRole = getHighestRankedRole(member);
    const memberRankedRoles = getMemberRankedRoles(member);

    for await (const memberRankedRole of memberRankedRoles) {
      await member.roles.remove(memberRankedRole);
    }

    const registrovanRole = getRole(interaction.guild as Guild, REGISTROVAN);
    const nextRole = getRole(
      interaction.guild as Guild,
      getNextRankedRole(highestRole as Role)
    );

    await member.roles.add(registrovanRole as Role);
    await member.roles.add(nextRole as Role);

    const emoji = ":tada:";
    const embed = new EmbedBuilder()
      .setColor(GOLD)
      .setDescription(
        `${emoji} ${member.user.toString()} je ocistio/ocistila ${emoji}`
      )
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
      { name: PRVA_GODINA, permission: true },
      { name: DRUGA_GODINA, permission: true },
      { name: TRECA_GODINA, permission: true },
      { name: EVERYONE, permission: false }
    ];
    return roles.map((role) => ({
      type: ROLE,
      permission: role.permission,
      id: getRole(guild as Guild, role.name)?.id as string
    }));
  }
}

const cistaCommand = new CistaCommand();
export default cistaCommand;
