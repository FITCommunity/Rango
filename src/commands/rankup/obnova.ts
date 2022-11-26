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
  memberHasRole,
  hasRoleResponse
} from "../../utils";
import { CommandPermission, ISlashCommand } from "../command";

class ObnovaCommand implements ISlashCommand {
  data = new SlashCommandBuilder()
    .setName("obnova")
    .setDescription("Obnova")
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

    const highestRole = getHighestRankedRole(member) as Role;
    const memberRankedRoles = getMemberRankedRoles(member);

    if (ukloniPrethodneGodineOption) {
      for await (const memberRankedRole of memberRankedRoles) {
        if (memberRankedRole.name !== highestRole.name) {
          await member.roles.remove(memberRankedRole);
        }
      }
    }

    const registrovanRole = getRole(
      interaction.guild as Guild,
      REGISTROVAN
    ) as Role;

    await member.roles.add(registrovanRole);

    const emoji = ":face_with_symbols_over_mouth:";
    const embed = new EmbedBuilder()
      .setColor(GOLD)
      .setDescription(
        `${emoji} ${member.user.toString()} je obnovio/obnovila ${emoji}`
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

const obnovaCommand = new ObnovaCommand();
export default obnovaCommand;
