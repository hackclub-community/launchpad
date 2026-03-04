import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { components } from './_generated/api';
import { type DataModel } from './_generated/dataModel';
import { query } from './_generated/server';
import { betterAuth, type BetterAuthOptions } from 'better-auth/minimal';
import authConfig from './auth.config';
import authSchema from './betterAuth/schema';
import { genericOAuth } from 'better-auth/plugins';

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(components.betterAuth, {
	local: {
		schema: authSchema
	}
});

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
	return {
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: false
		},
		plugins: [
			convex({ authConfig }),
			genericOAuth({
				config: [
					{
						providerId: 'hca',
						clientId: process.env.HCA_CLIENT_ID!,
						clientSecret: process.env.HCA_CLIENT_SECRET!,
						discoveryUrl: 'https://auth.hackclub.com/.well-known/openid-configuration',
						scopes: ['openid', 'email', 'name', 'profile']
					}
				]
			})
		]
	} satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) => {
	return betterAuth(createAuthOptions(ctx));
};

// Query to get current user
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return authComponent.safeGetAuthUser(ctx);
	}
});
