import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTeam = mutation({
  args: {
    eventId: v.id("events"),
    teamName: v.string(),
  },
  handler: async (ctx, args) => {

    return await ctx.db.insert("teams", {
      eventId: args.eventId,
      teamName: args.teamName,
    });

  },
});