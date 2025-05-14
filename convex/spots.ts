import { query, mutation } from './_generated/server'
import { Doc } from './_generated/dataModel'
import { v } from 'convex/values'

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
  handler: async (ctx): Promise<Doc<'spots'>[]> => {
    return await ctx.db
      .query('spots')
      .filter((q) => q.eq(q.field('is_published'), true))
      .collect()
  },
})
