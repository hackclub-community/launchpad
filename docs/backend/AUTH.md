# Authentication
Authentication is handled by [Better Auth](https://www.better-auth.com/).

This runs on Convex, and is implemented following the [Convex + Better Auth](https://labs.convex.dev/better-auth) guide as a [Convex component](https://www.convex.dev/components).

It is set up as a [Local Install](https://labs.convex.dev/better-auth/features/local-install), which allows using different database schema than what Convex Better Auth provides out of the box. This is required for using the organisation plugin, which is not in the [supported plugins list](https://labs.convex.dev/better-auth/supported-plugins).
