# Authentication

Authentication is handled by [Better Auth](https://www.better-auth.com/).

This runs on Convex, and is implemented following the [Convex + Better Auth](https://labs.convex.dev/better-auth) guide as a [Convex component](https://www.convex.dev/components).

## HCA

[HCA (Hack Club Auth)](https://auth.hackclub.com/) is configured as an OAuth provider via the [generic OAuth plugin](https://better-auth.com/docs/plugins/generic-oauth).

To set this up, you have to to set `HCA_CLIENT_ID` and `HCA_CLIENT_SECRET` environment variables _in Convex_.

```bash
npx convex env set HCA_CLIENT_ID=$(read)
npx convex env set HCA_CLIENT_SECRET=$(read)
```

## Local install

Better Auth is set up as a [Local Install](https://labs.convex.dev/better-auth/features/local-install), which allows using different database schema than what Convex Better Auth provides out of the box. This is required for using the organisation plugin, which is not in the [supported plugins list](https://labs.convex.dev/better-auth/supported-plugins).

The only caveat is that you will have to regenerate the schema manually, as it isn't already defined, whenever you add plugins that require it. You can do this by running:

```bash
cd src/convex/betterAuth/
npx @better-auth/cli generate -y
```
