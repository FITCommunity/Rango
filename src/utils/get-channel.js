module.exports.getTextChannel = async (guild, name) => guild.channels
    .fetch()
    .then((channels) =>
      channels.find((channel) => channel.name === name && channel.isText())
    )
    .then((channel) => channel)
    .catch(console.error);
