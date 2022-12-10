import { ISlashCommand } from "./command";
import * as miscCommands from "./misc";
import * as rankupCommands from "./rankup";
import * as memberCommands from "./member";

const commands: ISlashCommand[] = [
  miscCommands.echoCommand,
  miscCommands.inviteCommand,
  miscCommands.mutedCommand,
  rankupCommands.apsolventCommand,
  rankupCommands.cistaCommand,
  rankupCommands.diplomaCommand,
  rankupCommands.imatrikulantCommand,
  rankupCommands.kolizijaCommand,
  rankupCommands.uslovCommand,
  rankupCommands.obnovaCommand,
  memberCommands.addMemberComand
];
export default commands;
