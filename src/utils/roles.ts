import { Guild, GuildMember, Role } from "discord.js";
import rankedRoles from "../constants/rankedRoles";

const getRole = (guild: Guild, name: string) =>
  guild.roles.cache.find((role) => role.name === name);

const getRankedRoles = () => Object.keys(rankedRoles);

/* eslint-enable consistent-return */
function getMemberRankedRoles(member: GuildMember): Role[] {
  const roles = getRankedRoles();
  return Array.from(
    member.roles.cache.filter((role) => roles.includes(role.name)).values()
  );
}
/* eslint-disable consistent-return */

const getHighestRankedRole = (member: GuildMember, excludedRoles = []) => {
  const rankedRoleNames = getRankedRoles();
  const memberRankedRoles = getMemberRankedRoles(member);

  for (const rankedRole of rankedRoleNames.reverse()) {
    for (const memberRankedRole of memberRankedRoles) {
      if (
        memberRankedRole.name === rankedRole &&
        !excludedRoles.includes(rankedRole as never)
      ) {
        return memberRankedRole;
      }
    }
  }
};

const getNextRankedRole = (role: Role) =>
  rankedRoles[role.name as keyof typeof rankedRoles].Next;

const getKolizijaRole = (role: Role) =>
  rankedRoles[role.name as keyof typeof rankedRoles].Kolizija;

export {
  getRole,
  getMemberRankedRoles,
  getHighestRankedRole,
  getNextRankedRole,
  getKolizijaRole
};
