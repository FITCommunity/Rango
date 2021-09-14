const memberHasRole = (member, name) =>
  member.roles.cache.find((role) => role.name === name) !== null;

module.exports = { memberHasRole };
