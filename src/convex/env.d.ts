declare const process: {
	env: {
		SITE_URL?: string;
		GITHUB_CLIENT_ID?: string;
		GITHUB_CLIENT_SECRET?: string;
		GOOGLE_CLIENT_ID?: string;
		GOOGLE_CLIENT_SECRET?: string;
		HCA_CLIENT_ID?: string;
		HCA_CLIENT_SECRET?: string;
		[key: string]: string | undefined;
	};
};
