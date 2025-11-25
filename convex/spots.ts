import { query, mutation } from './_generated/server'
import { Doc, DataModel } from './_generated/dataModel'
import { v } from 'convex/values'
import { OrderedQuery, QueryInitializer } from 'convex/server'
import { ConvexError } from 'convex/values'

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
  args: {
    search: v.optional(v.string()),
    wifiQuality: v.optional(
      v.union(
        v.literal("Excellent"),
        v.literal("Good"),
        v.literal("Fair"),
        v.literal("Poor"),
        v.literal("Unknown")
      )
    ),
    foodAvailable: v.optional(v.boolean()),
    crowdLevel: v.optional(
      v.union(v.literal("Quiet"), v.literal("Moderate"), v.literal("Busy"), v.literal("Varies"), v.literal("Unknown"))
    ),
  },
  handler: async (ctx, { search, wifiQuality, foodAvailable, crowdLevel }): Promise<Doc<'spots'>[]> => {
    // Stage 1: Pick the table to query
    const tableQuery: QueryInitializer<DataModel['spots']> = ctx.db.query('spots')

    // Stage 2: Apply search index if search term is provided
    let orderedQuery: OrderedQuery<DataModel['spots']>;
    if (search) {
      // Search index provides both indexing and ordering by relevance
      orderedQuery = tableQuery.withSearchIndex('search_name', (q) => q.search('name', search))
    } else {
      // If no search, just use the base query with default order
      orderedQuery = tableQuery
    }

    // Stage 3: Apply filters
    orderedQuery = orderedQuery.filter((q) => q.eq(q.field('is_published'), true))
    // Filter by wifiQuality
    if (wifiQuality) {
      orderedQuery = orderedQuery.filter((q) => q.eq(q.field('wifi_quality'), wifiQuality))
    }
    // Filter by foodAvailable
    if (foodAvailable !== undefined) {
      orderedQuery = orderedQuery.filter((q) => q.eq(q.field('food_available'), foodAvailable))
    }
    // Filter by crowdLevel
    if (crowdLevel) {
      orderedQuery = orderedQuery.filter((q) => q.eq(q.field('crowd_level_typical'), crowdLevel))
    }

    // Stage 4: Get results
    return await orderedQuery.collect()
  },
})

/**
 * Submit a new spot suggestion
 * 
 * DATA RETENTION & PII POLICY:
 * - Suggester email/name are optional PII fields stored for admin follow-up only
 * - Retention: Suggestions retained for 90 days after approval/rejection, then deleted
 * - Access: Only authorized admins can view PII fields in Convex dashboard
 * - Rights: Users can request deletion by emailing support (include spot name + submission date)
 * - GDPR/CCPA: Complies with Convex DPA - see https://www.convex.dev/terms/dpa
 * - No automated processing or profiling of PII data
 * - Email never shared with third parties or used for marketing
 * 
 * VALIDATION:
 * - spot_name: Required, max 200 chars
 * - All notes fields: Optional, max 500 chars each
 * - suggester_name: Optional, max 100 chars
 * - suggester_email: Optional, must be valid email format
 * - All text fields trimmed and sanitized
 */
export const submitSuggestion = mutation({
  args: {
    spot_name: v.string(),
    address: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    reason: v.optional(v.string()),
    wifi_notes: v.optional(v.string()),
    food_notes: v.optional(v.string()),
    crowd_notes: v.optional(v.string()),
    power_notes: v.optional(v.string()),
    other_notes: v.optional(v.string()),
    suggester_name: v.optional(v.string()),
    suggester_email: v.optional(v.string()), // Validated in handler
  },
  returns: v.id("suggestions"),
  handler: async (ctx, args) => {
    // === VALIDATION & SANITIZATION ===
    
    // Trim all string fields
    const trimmed = {
      spot_name: args.spot_name.trim(),
      address: args.address?.trim(),
      neighborhood: args.neighborhood?.trim(),
      reason: args.reason?.trim(),
      wifi_notes: args.wifi_notes?.trim(),
      food_notes: args.food_notes?.trim(),
      crowd_notes: args.crowd_notes?.trim(),
      power_notes: args.power_notes?.trim(),
      other_notes: args.other_notes?.trim(),
      suggester_name: args.suggester_name?.trim(),
      suggester_email: args.suggester_email?.trim(),
    };

    // Validate required field: spot_name
    if (!trimmed.spot_name || trimmed.spot_name.length === 0) {
      throw new ConvexError({
        code: "VALIDATION_ERROR",
        message: "Spot name is required and cannot be empty",
        field: "spot_name",
      });
    }

    // Validate spot_name length (max 200 chars)
    if (trimmed.spot_name.length > 200) {
      throw new ConvexError({
        code: "VALIDATION_ERROR",
        message: "Spot name must be 200 characters or less",
        field: "spot_name",
        maxLength: 200,
        actualLength: trimmed.spot_name.length,
      });
    }

    // Validate optional text fields (max 500 chars each)
    const textFields: Array<{ name: string; value?: string }> = [
      { name: "address", value: trimmed.address },
      { name: "neighborhood", value: trimmed.neighborhood },
      { name: "reason", value: trimmed.reason },
      { name: "wifi_notes", value: trimmed.wifi_notes },
      { name: "food_notes", value: trimmed.food_notes },
      { name: "crowd_notes", value: trimmed.crowd_notes },
      { name: "power_notes", value: trimmed.power_notes },
      { name: "other_notes", value: trimmed.other_notes },
    ];

    for (const field of textFields) {
      if (field.value && field.value.length > 500) {
        throw new ConvexError({
          code: "VALIDATION_ERROR",
          message: `${field.name.replace(/_/g, " ")} must be 500 characters or less`,
          field: field.name,
          maxLength: 500,
          actualLength: field.value.length,
        });
      }
    }

    // Validate suggester_name length (max 100 chars)
    if (trimmed.suggester_name && trimmed.suggester_name.length > 100) {
      throw new ConvexError({
        code: "VALIDATION_ERROR",
        message: "Your name must be 100 characters or less",
        field: "suggester_name",
        maxLength: 100,
        actualLength: trimmed.suggester_name.length,
      });
    }

    // Validate suggester_email format (basic email validation)
    if (trimmed.suggester_email) {
      // Max length check
      if (trimmed.suggester_email.length > 254) {
        throw new ConvexError({
          code: "VALIDATION_ERROR",
          message: "Email address must be 254 characters or less",
          field: "suggester_email",
          maxLength: 254,
          actualLength: trimmed.suggester_email.length,
        });
      }

      // Basic email format validation (RFC 5322 simplified)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed.suggester_email)) {
        throw new ConvexError({
          code: "VALIDATION_ERROR",
          message: "Please provide a valid email address",
          field: "suggester_email",
        });
      }

      // Reject obviously fake/test emails
      const suspiciousPatterns = [
        /test@test/i,
        /fake@fake/i,
        /example@example/i,
        /spam@spam/i,
        /^a+@/i, // aaaa@domain.com
      ];
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(trimmed.suggester_email)) {
          throw new ConvexError({
            code: "VALIDATION_ERROR",
            message: "Please provide a real email address",
            field: "suggester_email",
          });
        }
      }
    }

    // Calculate total payload size (rough estimate)
    const totalSize = Object.values(trimmed).reduce((sum, val) => {
      return sum + (val ? val.length : 0);
    }, 0);

    // Reject overly large payloads (max 5KB total)
    if (totalSize > 5000) {
      throw new ConvexError({
        code: "VALIDATION_ERROR",
        message: "Total submission size is too large. Please reduce the amount of text.",
        totalSize,
        maxSize: 5000,
      });
    }

    // === INSERT VALIDATED DATA ===
    const suggestionId = await ctx.db.insert("suggestions", {
      spot_name: trimmed.spot_name,
      address: trimmed.address,
      neighborhood: trimmed.neighborhood,
      reason: trimmed.reason,
      wifi_notes: trimmed.wifi_notes,
      food_notes: trimmed.food_notes,
      crowd_notes: trimmed.crowd_notes,
      power_notes: trimmed.power_notes,
      other_notes: trimmed.other_notes,
      suggester_name: trimmed.suggester_name,
      suggester_email: trimmed.suggester_email,
      submitted_at: Date.now(),
      status: "pending",
    });

    return suggestionId;
  },
})