import { query } from './_generated/server'
import { Doc } from './_generated/dataModel'

export const listPublishedSpots = query({
  handler: async (ctx): Promise<Doc<'spots'>[]> => {
    return await ctx.db
      .query('spots')
      .filter((q) => q.eq(q.field('is_published'), true))
      .collect()
  },
})
