import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createEvent = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {

    return await ctx.db.insert("events", {
      name: args.name,
      slug: args.slug,
      createdBy: args.createdBy,
    });

  },
});