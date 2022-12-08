import {
  Client,
  CommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import { ROLE, USER } from "../constants/permissionTypes";

export type CommandPermission = {
  type: typeof ROLE | typeof USER;
  permission: boolean;
  id: string;
};

export interface ISlashCommand {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  execute: (interaction: CommandInteraction) => Promise<void>;
  getPermissions: (client: Client) => Promise<CommandPermission[]>;
}
