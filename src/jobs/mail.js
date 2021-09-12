const cron = require("node-cron");
const { getNewMail, setMailSeen } = require("../mail");
const { getGuild, getTextChannel } = require("../utils");
const { MAIL } = require("../constants/channels");

module.exports.scheduler = async (client) => {
  const guild = await getGuild(client, process.env.GUILD_NAME);
  const channel = await getTextChannel(guild, MAIL);

  cron.schedule("*/1 * * * *", async () => {
    const mail = await getNewMail();

    await Promise.all(
      mail.map(async (message) => {
        await channel.send(message.body);
      })
    );

    await setMailSeen(mail);
  });
};
