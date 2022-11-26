import { Role, Events, EmbedBuilder } from "discord.js";
import { getTextChannel, getRole } from "../utils";
import { LOGGER } from "../constants/channels";
import { GREEN } from "../constants/colors";
import { NEREGISTROVAN } from "../constants/roles";
import { IEvent } from "./event";

class GuildMemberAddEvent implements IEvent {
  name = Events.GuildMemberAdd;
  once = false;
  async execute(...args: any): Promise<void> {
    const { member } = args;

    const { guild } = member;
    const embed = new EmbedBuilder()
      .setColor(GREEN)
      .setTitle("Member Joined")
      .setDescription(member.user.toString())
      .addFields([
        {
          name: "Created",
          value: member.user.createdAt.toString(),
          inline: true
        },
        {
          name: "Joined",
          value: member.joinedAt?.toString() as string,
          inline: true
        }
      ])
      .setAuthor({
        name: member.displayName,
        iconURL: member.user.avatarURL() as string
      })
      .setTimestamp()
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL() as string
      });

    const channel = await getTextChannel(guild, LOGGER);
    await channel?.send({ embeds: [embed] });

    const role = getRole(member.guild, NEREGISTROVAN);
    member.roles.add(role as Role);
  }
}

const guildMemberAddEvent = new GuildMemberAddEvent();
export default guildMemberAddEvent;
