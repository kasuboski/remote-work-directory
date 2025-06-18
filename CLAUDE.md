# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
- `npm run dev` - Start development server with Convex dev and Wrangler in watch mode
- `npm run deploy` - Deploy to Cloudflare Workers with minification
- `npm run cf-typegen` - Generate CloudflareBindings types from Wrangler configuration

### Package Management
- `npm install` - Install dependencies

## Architecture Overview

This is a **Remote Work Spot Directory** web application for Austin, Texas, built with modern serverless technologies:

### Tech Stack
- **Frontend**: Hono framework with server-side rendered JSX
- **Runtime**: Cloudflare Workers (edge computing)
- **Database**: Convex (real-time backend-as-a-service)
- **Styling**: Static CSS files served from `/public/static/`

### Key Architecture Patterns

**Server-Side Rendering with Hono**
- All pages are server-rendered JSX components using Hono's JSX runtime
- Routes defined in `src/index.tsx` handle HTTP requests and render components
- JSX import source configured as "hono/jsx" in `tsconfig.json`

**Convex Backend Integration**
- Database schema defined in `convex/schema.ts` with the `spots` table
- Query/mutation functions in `convex/spots.ts` handle data operations
- ConvexHttpClient used in route handlers to fetch data from Convex
- Generated types from `convex/_generated/` provide type safety

**Component Structure**
- Reusable components in `src/components/`:
  - `Layout.tsx` - Shared page layout with header/footer
  - `SpotCard.tsx` - Individual spot listing display
  - `SpotDetail.tsx` - Full spot details page
  - `SuggestSpotPage.tsx` - User suggestion form
  - `icons/` - SVG icon components

**Data Model**
The `spots` table contains remote work location data with fields for:
- Basic info (name, address, neighborhood, slug)
- Amenities (wifi_quality, food_available, power_outlets, crowd_level_typical)
- Metadata (is_published, date_last_verified_admin)
- Rich content (main_photo_url, description_admin, hours_of_operation_text)

**Routing Strategy**
- `/` - Homepage with filterable spot listings
- `/spots/:slug` - Individual spot detail pages (slug-based URLs)
- `/suggest` - User suggestion form
- Static assets served from `/public/static/`

**Environment Variables**
- `CONVEX_URL` - Convex backend endpoint
- `GOOGLE_MAPS_API_KEY` - For embedded maps in spot details

## Development Guidelines

### Convex Functions
- Use `query` for read operations, `mutation` for writes
- All Convex functions include proper TypeScript validation with `v` schema
- Queries support filtering by `is_published`, search, and amenity filters
- Slug generation ensures uniqueness with automatic counter suffixes

### Component Development
- Components use Hono's JSX with lowercase HTML attributes (`class` not `className`)
- Server-side rendering means no client-side React hooks
- Inline styles use string syntax: `style="text-decoration: none; color: inherit;"`
- Icons are implemented as separate TSX components returning SVG

### URL Structure
- Spot detail pages use SEO-friendly slugs generated from spot names
- Search and filters passed as URL query parameters for bookmarkable URLs
- Form submissions use GET method to maintain URL-based state

### CSS Organization
- Main styles in `/public/static/styles.css`
- Component-specific styles in separate CSS files (SpotDetail.css, SuggestSpot.css)
- CSS loaded in Layout component with multiple `<link>` tags for different sections

## Development Workflow

**Prerequisites**: User should be running `npm run dev` and `npx convex dev` in background
- All terminal commands must be prefixed with `direnv exec .`
- Example: `direnv exec . npm run cf-typegen`
- Site available at http://localhost:8787 during development

**Standard Workflow**:
1. Reference appropriate documentation
2. Make code changes
3. Run `direnv exec . npx convex dev --once` to check Convex changes
4. Test UI changes if applicable
5. Repeat

## Cloudflare Workers Integration

- **Bindings**: Add to `wrangler.jsonc`, then run `npm run cf-typegen` to generate types
- **Types**: CloudflareBindings available globally (don't import or augment)
- **Documentation**: See `docs/cloudflare-workers.md` for CF-specific guidance

## Design System

- **Icons**: Use Heroicons.com exclusively, stored in `src/components/icons/`
- **New Icons**: Find SVG at heroicons.com, create new component in icons folder

## TypeScript Standards

**Core Principles**:
- Strong typing preferred over inference when clarity needed
- Avoid `any` - use `unknown` with type guards instead
- Use specific types over broad ones (`string` vs `object`)
- Always type function parameters and return values

**Type Safety Patterns**:
```typescript
// Type guard for runtime checks
function hasSecret<K extends string>(
  env: CloudflareBindings,
  key: K,
): env is CloudflareBindings & Record<K, string> {
  return typeof (env as any)[key] === "string";
}
```

## Convex Development

**Reference**: See `.windsurf/rules/convex_rules.md` for comprehensive Convex guidelines

**Key Patterns**:
- Always use new function syntax with explicit `args`, `returns`, and `handler`
- Include argument and return validators for all functions
- Use `v.null()` for functions that don't return values
- Prefer indexed queries over filter operations
- Use proper function references with `api` and `internal` objects