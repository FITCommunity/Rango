import { GuildMember } from "discord.js";

const memberHasRole = (member: GuildMember, name: string): boolean => {
  const result = member.roles.cache.find((role) => role.name === name);
  return result !== undefined && result !== null;
};

export { memberHasRole };
