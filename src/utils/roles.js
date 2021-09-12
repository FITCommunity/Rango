const getRole = (guild, name) => guild.roles.cache.find((role) => role.name === name);

module.exports = { getRole };
