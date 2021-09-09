const fs = require("fs");
const path = require("path");

const { Client, Collection, Intents } = require("discord.js");
const { discord } = require("./app.development.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

fs.readdirSync(path.resolve(__dirname, "commands")).forEach((dir) => {
  const commandFiles = fs
    .readdirSync(path.resolve(__dirname, `commands/${dir}`))
    .filter((files) => files.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${dir}/${file}`);
    client.commands.set(command.data.name, command);
  }
});

const eventFiles = fs
  .readdirSync(path.resolve(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true
    });
  }
});

client.login(discord.token);
