const memberHasRole = (member, name) => {
  const result = member.roles.cache.find((role) => role.name === name);
  return result !== undefined && result !== null;
};

module.exports = { memberHasRole };
