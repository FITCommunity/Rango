import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
  Role,
  SlashCommandBuilder
} from "discord.js";
import {
  TRECA_GODINA,
  CETVRTA_GODINA,
  APSOLVENT,
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
  memberHasRole,
  hasRoleResponse
} from "../../utils";
import { CommandPermission, ISlashCommand } from "../command";

class ApsolventCommand implements ISlashCommand {
  data = new SlashCommandBuilder()
    .setName("apsolvent")
    .setDescription("Upisan apsolventski staž!")
    .addBooleanOption((option) =>
      option
        .setName("ukloni-prethodne-godine")
        .setDescription("Uklanja uloge za prethodne godine")
        .setRequired(true)
    )
    .toJSON();
  async execute(interaction: CommandInteraction): Promise<void> {
    const ukloniPrethodneGodineOption = interaction.options.get(
      "ukloni-prethodne-godine"
    )?.value;

    const member = interaction.member as GuildMember;

    if (memberHasRole(member, REGISTROVAN)) {
      await interaction.reply(hasRoleResponse);
      return;
    }

    const highestRole = getHighestRankedRole(member);
    const memberRankedRoles = getMemberRankedRoles(member);

    if (ukloniPrethodneGodineOption) {
      for await (const memberRankedRole of memberRankedRoles) {
        if (memberRankedRole.name !== highestRole?.name) {
          await member.roles.remove(memberRankedRole);
        }
      }
    }

    const guild = interaction.guild as Guild;
    const registrovanRole = getRole(guild, REGISTROVAN) as Role;
    const apsolventRole = getRole(guild, APSOLVENT) as Role;

    await member.roles.add([registrovanRole, apsolventRole]);

    const emoji = ":money_mouth:";
    const embed = new EmbedBuilder()
      .setColor(GOLD)
      .setDescription(
        `${emoji} ${member.user.toString()} je apsolvent ${emoji}`
      )
      .setAuthor({
        name: member.displayName
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

const apsolventCommand = new ApsolventCommand();
export default apsolventCommand;
