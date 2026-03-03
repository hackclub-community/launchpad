# Launchpad Developer Docs

## Overview
Launchpad is a SvelteKit app. It uses Convex as a database and to host Better Auth. The UI components are (probably going to be) based on shadcn/ui. Styles are done with Tailwind CSS.

## Development quickstart
```bash
# Install deps
bun install

# Run convex dev
# I recommend using a cloud deployment because its a lot easier to do
bunx convex dev

# `convex dev` should have added PUBLIC_CONVEX_URL and PUBLIC_CONVEX_SITE_URL
# You have to add PUBLIC_SITE_URL, which should be http://localhost:5173
echo "PUBLIC_SITE_URL=http://localhost:5173" >> .env

# Run dev server
bun dev

# Now navigate to localhost:5173
```
