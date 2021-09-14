const getGuild = async (client, name) => {
  const guilds = await client.guilds.fetch();
  const oaut2guild = guilds.find((guild) => guild.name === name);
  return oaut2guild.fetch();
};

module.exports = { getGuild };
