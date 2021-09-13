const path = require("path");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents } = require("discord.js");
const dotenv = require("dotenv");

dotenv.config();

const commands = [];
fs.readdirSync(path.resolve(__dirname, "commands")).forEach((dir) => {
  const commandFiles = fs
    .readdirSync(path.resolve(__dirname, `commands/${dir}`))
    .filter((files) => files.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${dir}/${file}`);
    commands.push(command);
  }
});

const rest = new REST({ version: "9" }).setToken(
  process.env.DISCORD_CLIENT_TOKEN
);

(async () => {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS]
  });

  await client.login(process.env.DISCORD_CLIENT_TOKEN);

  try {
    const deployedCommands = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      {
        body: commands.map((command) => command.data.toJSON())
      }
    );

    const permissionCommands = commands.filter(
      (command) => command.getPermissions != null
    );

    const permissionList = await Promise.all(
      permissionCommands.map(async (command) => {
        const deployedCommand = deployedCommands.find(
          (cmd) => command.data.name === cmd.name
        );

        const permissions = await command.getPermissions(client);

        return {
          id: deployedCommand.id,
          permissions: [...permissions]
        };
      })
    );

    await rest.put(
      Routes.guildApplicationCommandsPermissions(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: permissionList }
    );

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }

  client.destroy();
})();
