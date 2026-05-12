export const oauthProviders = [
	{ id: 'hca', label: 'Hack Club' },
	{ id: 'github', label: 'GitHub' },
	{ id: 'google', label: 'Google' }
] as const;

export type OAuthProviderId = (typeof oauthProviders)[number]['id'];
