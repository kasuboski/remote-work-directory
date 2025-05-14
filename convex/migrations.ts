import { mutation } from './_generated/server'
import { slugify } from './spots'

export const migrateAddSlugs = mutation({
  handler: async (ctx) => {
    const spots = await ctx.db.query('spots').collect()
    
    for (const spot of spots) {
      const baseSlug = slugify(spot.name)
      let slug = baseSlug
      let counter = 1

      // Keep trying until we find a unique slug
      while (true) {
        const existing = await ctx.db
          .query('spots')
          .filter((q) => 
            q.and(
              q.eq(q.field('slug'), slug),
              q.neq(q.field('_id'), spot._id)
            )
          )
          .first()

        if (!existing) {
          await ctx.db.patch(spot._id, { slug })
          break
        }

        slug = `${baseSlug}-${counter}`
        counter++
      }
    }
  },
})
