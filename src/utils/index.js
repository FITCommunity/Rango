const { getTextChannel } = require("./channel");
const { getGuild } = require("./guild");
const { memberHasRole } = require("./checks");
const { hasRoleResponse } = require("./errorResponse");
const {
  getRole,
  getMemberRankedRoles,
  getHighestRankedRole,
  getNextRankedRole
} = require("./roles");

module.exports = {
  getTextChannel,
  getGuild,
  getRole,
  getMemberRankedRoles,
  getHighestRankedRole,
  getNextRankedRole,
  memberHasRole,
  hasRoleResponse
};
