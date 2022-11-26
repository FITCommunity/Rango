import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
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

class UslovCommand implements ISlashCommand {
  data = new SlashCommandBuilder()
    .setName("uslov")
    .setDescription("Uslov!")
    .toJSON();
  async execute(interaction: CommandInteraction): Promise<void> {
    const member = interaction.member as GuildMember;

    if (memberHasRole(member, REGISTROVAN)) {
      await interaction.reply(hasRoleResponse);
      return;
    }

    const highestRole = getHighestRankedRole(member) as Role;
    const memberRankedRoles = getMemberRankedRoles(member);

    for await (const memberRankedRole of memberRankedRoles) {
      if (memberRankedRole.name !== highestRole.name) {
        await member.roles.remove(memberRankedRole);
      }
    }

    const guild = interaction.guild as Guild;
    const registrovanRole = getRole(guild, REGISTROVAN) as Role;
    const nextRole = getRole(guild, getNextRankedRole(highestRole)) as Role;

    await member.roles.add(registrovanRole);
    await member.roles.add(nextRole);

    const emoji = ":tada:";
    const embed = new EmbedBuilder()
      .setColor(GOLD)
      .setDescription(
        `${emoji} ${member.user.toString()} je ispunio/ispunila uslov ${emoji}`
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

const uslovCommand = new UslovCommand();
export default uslovCommand;
