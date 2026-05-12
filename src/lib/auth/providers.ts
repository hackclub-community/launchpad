export const oauthProviders = [
	{ id: 'hca', label: 'Hack Club', primary: true },
	{ id: 'github', label: 'GitHub', primary: false },
	{ id: 'google', label: 'Google', primary: false }
] as const;

export type OAuthProviderId = (typeof oauthProviders)[number]['id'];
