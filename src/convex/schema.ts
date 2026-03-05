import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  events: defineTable({
    name: v.string(),
    slug: v.string(),
    createdBy: v.string(), // BetterAuth user id
  }),

  teams: defineTable({
    eventId: v.id("events"),
    teamName: v.string(),
  }).index("by_event", ["eventId"]),

  teamMembers: defineTable({
    teamId: v.id("teams"),
    name: v.string(),
    code: v.string(),
  }).index("by_team", ["teamId"]),

});