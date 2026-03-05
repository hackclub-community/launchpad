import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addMember = mutation({
  args: {
    teamId: v.id("teams"),
    name: v.string(),
    code: v.string(),
  },

  handler: async (ctx, args) => {

    return await ctx.db.insert("teamMembers", {
      teamId: args.teamId,
      name: args.name,
      code: args.code,
    });

  },
});