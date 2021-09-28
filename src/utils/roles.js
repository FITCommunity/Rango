const { rankedRoles } = require("../constants/rankedRoles");

const getRole = (guild, name) =>
  guild.roles.cache.find((role) => role.name === name);

const getRankedRoles = () => Object.keys(rankedRoles);

/* eslint-enable consistent-return */
const getMemberRankedRoles = (member) => {
  const roles = getRankedRoles();
  return Array.from(
    member.roles.cache.filter((role) => roles.includes(role.name)).values()
  );
};
/* eslint-disable consistent-return */

const getHighestRankedRole = (member, excludedRoles = []) => {
  const rankedRoleNames = getRankedRoles();
  const memberRankedRoles = getMemberRankedRoles(member);

  for (const rankedRole of rankedRoleNames.reverse()) {
    for (const memberRankedRole of memberRankedRoles) {
      if (
        memberRankedRole.name === rankedRole &&
        !excludedRoles.includes(rankedRoles)
      ) {
        return memberRankedRole;
      }
    }
  }
};

const getNextRankedRole = (role) => rankedRoles[role.name].Next;

module.exports = {
  getRole,
  getMemberRankedRoles,
  getHighestRankedRole,
  getNextRankedRole
};
