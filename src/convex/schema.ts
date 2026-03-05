import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	organisations: defineTable({
		name: v.string()
	}),

	teams: defineTable({
		eventId: v.id('organisations'),
		name: v.string()
	}).index('by_event', ['eventId']),

	teamMembers: defineTable({
		teamId: v.id('teams'),
		name: v.string(),
		code: v.string()
	}).index('by_team', ['teamId'])
});
