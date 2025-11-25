# Agent Guide for Remote Work Directory

## Commands
- **Dev**: `direnv exec . npm run dev` (Convex + Wrangler watch mode) - User should be running this
- **Deploy**: `direnv exec . npm run deploy` (Cloudflare Workers deployment)
- **Type generation**: `direnv exec . npm run cf-typegen` (Generate CloudflareBindings from wrangler.jsonc)
- **Convex check**: `direnv exec . npx convex dev --once` (Validate Convex changes)
- **All commands**: Prefix with `direnv exec .` to load environment

## Code Style

**TypeScript**: Strict mode enabled. Always type function parameters and returns. Avoid `any` - use `unknown` with type guards. Use specific types over broad ones.

**Imports**: Hono JSX from `hono/jsx`, Convex from `convex/browser` (client) or `./_generated/server` (backend). Use `api`/`internal` objects for function references.

**JSX**: Hono JSX runtime with lowercase HTML attributes (`class` not `className`), string-based inline styles. Icons from heroicons.com stored in `src/components/icons/`.

**Convex**: Always use new function syntax with explicit `args`, `returns`, and `handler`. Include validators for all functions. Use `v.null()` for functions returning nothing. Use indexes instead of `.filter()`. See `docs/convex.md` for details.

**Naming**: Descriptive function/variable names. Use `const` by default. Type arrays as `Array<T>` and records as `Record<K, V>`.

**Error Handling**: Throw descriptive errors. Validate inputs with Convex validators. Check for null/undefined before accessing properties.

**Cloudflare**: Add bindings to `wrangler.jsonc`, then run `npm run cf-typegen`. CloudflareBindings available globally - never import or augment. See `docs/cloudflare-workers.md`.
