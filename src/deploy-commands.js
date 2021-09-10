const path = require("path");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const dotenv = require("dotenv");

dotenv.config();

const commands = [];
fs.readdirSync(path.resolve(__dirname, "commands")).forEach((dir) => {
  const commandFiles = fs
    .readdirSync(path.resolve(__dirname, `commands/${dir}`))
    .filter((files) => files.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${dir}/${file}`);
    commands.push(command.data.toJSON());
  }
});

const rest = new REST({ version: "9" }).setToken(
  process.env.DISCORD_CLIENT_TOKEN
);

(async () => {
  try {
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
