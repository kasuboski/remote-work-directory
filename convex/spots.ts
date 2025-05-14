import { query, mutation } from './_generated/server'
import { Doc, DataModel } from './_generated/dataModel'
import { v } from 'convex/values'
import { OrderedQuery, QueryInitializer } from 'convex/server'

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const getSpotBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }): Promise<Doc<'spots'> | null> => {
    const spot = await ctx.db
      .query('spots')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .filter((q) => q.eq(q.field('is_published'), true))
      .first()
    return spot
  },
})

export const generateSlug = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }): Promise<string> => {
    const baseSlug = slugify(name)
    let slug = baseSlug
    let counter = 1

    // Keep trying until we find a unique slug
    while (true) {
      const existing = await ctx.db
        .query('spots')
        .withIndex('by_slug', (q) => q.eq('slug', slug))
        .first()

      if (!existing) {
        return slug
      }

      slug = `${baseSlug}-${counter}`
      counter++
    }
  },
})

export const listPublishedSpots = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, { search }): Promise<Doc<'spots'>[]> => {
    // Stage 1: Pick the table to query
    const tableQuery: QueryInitializer<DataModel['spots']> = ctx.db.query('spots')

    // Stage 2: Apply search index if search term is provided
    let orderedQuery: OrderedQuery<DataModel['spots']>
    if (search) {
      // Search index provides both indexing and ordering by relevance
      orderedQuery = tableQuery.withSearchIndex('search_name', (q) => q.search('name', search))
    } else {
      // If no search, just use the base query with default order
      orderedQuery = tableQuery
    }

    // Stage 3: Apply filters
    orderedQuery = orderedQuery.filter((q) => q.eq(q.field('is_published'), true))

    // Stage 4: Get results
    return await orderedQuery.collect()
  },
})