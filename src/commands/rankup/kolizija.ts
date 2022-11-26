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
  getHighestRankedRole,
  getKolizijaRole,
  memberHasRole,
  hasRoleResponse
} from "../../utils";
import { CommandPermission, ISlashCommand } from "../command";

class KolizijaCommand implements ISlashCommand {
  data = new SlashCommandBuilder()
    .setName("kolizija")
    .setDescription("Upisana kolizija!")
    .toJSON();
  async execute(interaction: CommandInteraction): Promise<void> {
    const member = interaction.member as GuildMember;

    if (memberHasRole(member, REGISTROVAN)) {
      await interaction.reply(hasRoleResponse);
      return;
    }

    const highestRole = getHighestRankedRole(member);

    const guild = interaction.guild as Guild;
    const registrovanRole = getRole(guild, REGISTROVAN) as Role;
    const kolizijaRole = getRole(
      guild,
      getKolizijaRole(highestRole as Role)
    ) as Role;

    await member.roles.add(registrovanRole);
    await member.roles.add(kolizijaRole);

    const emoji = ":money_with_wings:";
    const embed = new EmbedBuilder()
      .setColor(GOLD)
      .setDescription(
        `${emoji} ${member.user.toString()} je upisao/la koliziju ${emoji}`
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

const kolizijaCommand = new KolizijaCommand();
export default kolizijaCommand;
