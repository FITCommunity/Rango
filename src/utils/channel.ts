import { Guild, TextChannel } from "discord.js";

const getTextChannel = async (
  guild: Guild,
  name: string
): Promise<TextChannel | undefined> => {
  const channels = await guild.channels.fetch();
  return channels.find((channel) => channel?.name === name) as TextChannel;
};

export { getTextChannel };
