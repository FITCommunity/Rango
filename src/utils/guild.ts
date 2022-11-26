import { Client, Guild } from "discord.js";

const getGuild = async (
  client: Client,
  name: string
): Promise<Guild | undefined> => {
  const guilds = await client.guilds.fetch();
  const oaut2guild = guilds.find((guild) => guild.name === name);
  return oaut2guild?.fetch();
};

export { getGuild };
