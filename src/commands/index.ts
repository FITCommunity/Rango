import { ISlashCommand } from "./command";
import * as miscCommands from "./misc";
import * as rankupCommands from "./rankup";

const commands: ISlashCommand[] = [
  miscCommands.echoCommand,
  miscCommands.inviteCommand,
  rankupCommands.apsolventCommand,
  rankupCommands.cistaCommand,
  rankupCommands.diplomaCommand,
  rankupCommands.imatrikulantCommand,
  rankupCommands.kolizijaCommand,
  rankupCommands.uslovCommand,
  rankupCommands.obnovaCommand
];
export default commands;
