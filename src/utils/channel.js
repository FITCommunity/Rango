const getTextChannel = async (guild, name) => {
  const channels = await guild.channels.fetch();
  return channels.find((channel) => channel.name === name);
};

module.exports = { getTextChannel };
