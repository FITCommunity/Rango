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
  APSOLVENT,
  IMATRIKULANT,
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

class ImatrikulantCommand implements ISlashCommand {
  data = new SlashCommandBuilder()
    .setName("imatrikulant")
    .setDescription("Upisan imatrikulantski staž!")
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

    const highestRole = getHighestRankedRole(member, [
      APSOLVENT as never,
      IMATRIKULANT as never
    ]);
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
    const imatrikulantRole = getRole(guild, IMATRIKULANT) as Role;

    await member.roles.remove(apsolventRole);
    await member.roles.add([registrovanRole, imatrikulantRole]);

    const emoji = ":moneybag:";
    const embed = new EmbedBuilder()
      .setColor(GOLD)
      .setDescription(
        `${emoji} ${member.user.toString()} je imatrikulant ${emoji}`
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
      { name: APSOLVENT, permission: true },
      { name: IMATRIKULANT, permission: true },
      { name: EVERYONE, permission: false }
    ];
    return roles.map((role) => ({
      type: ROLE,
      permission: role.permission,
      id: getRole(guild as Guild, role.name)?.id as string
    }));
  }
}

const imatrikulantCommand = new ImatrikulantCommand();
export default imatrikulantCommand;
