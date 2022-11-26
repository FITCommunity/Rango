import { Routes } from "discord-api-types/v9";
import { Client, GatewayIntentBits, REST } from "discord.js";
import dotenv from "dotenv";
import commands from "./commands";

dotenv.config();

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_CLIENT_TOKEN as string
);

(async () => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
  });

  await client.login(process.env.DISCORD_CLIENT_TOKEN);

  try {
    const deployedCommands = (await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
      {
        body: commands.map((command) => command.data)
      }
    )) as { name: string; id: BigInt }[];

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
          id: deployedCommand?.id,
          permissions: [...permissions]
        };
      })
    );

    await rest.put(
      Routes.guildApplicationCommandsPermissions(
        process.env.DISCORD_CLIENT_ID as string,
        process.env.DISCORD_GUILD_ID as string
      ),
      { body: permissionList }
    );

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }

  client.destroy();
})();
