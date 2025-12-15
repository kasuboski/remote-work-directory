import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const placeArgs = {
  name: v.string(),
  slug: v.string(),
  address: v.string(),
  neighborhood: v.optional(v.string()),
  google_places_id: v.optional(v.string()),
  wifi_quality: v.union(
    v.literal("Excellent"),
    v.literal("Good"),
    v.literal("Fair"),
    v.literal("Poor"),
    v.literal("Unknown")
  ),
  wifi_notes: v.optional(v.string()),
  food_available: v.boolean(),
  food_notes: v.optional(v.string()),
  crowd_level_typical: v.union(
    v.literal("Quiet"),
    v.literal("Moderate"),
    v.literal("Busy"),
    v.literal("Varies"),
    v.literal("Unknown")
  ),
  crowd_notes: v.optional(v.string()),
  power_outlets: v.union(
    v.literal("Plenty"),
    v.literal("Some"),
    v.literal("Few"),
    v.literal("None"),
    v.literal("Unknown")
  ),
  other_amenities_text: v.optional(v.string()),
  description_admin: v.optional(v.string()),
  main_photo_url: v.optional(v.string()),
  hours_of_operation_text: v.optional(v.string()),
  website_url: v.optional(v.string()),
  phone_number: v.optional(v.string()),
  date_last_verified_admin: v.string(),
  is_published: v.boolean(),
  content: v.string(),
};

export const syncPlaces = mutation({
  args: {
    places: v.array(v.object(placeArgs)),
  },
  handler: async (ctx, args) => {
    const existingPlaces = await ctx.db.query("spots").collect();
    const incomingSlugs = new Set(args.places.map((p) => p.slug));
    const existingSlugs = new Set(existingPlaces.map((p) => p.slug));

    let created = 0;
    let updated = 0;
    let deleted = 0;

    // Create or update places
    for (const place of args.places) {
      const existingPlace = existingPlaces.find((p) => p.slug === place.slug);
      if (existingPlace) {
        // Update
        await ctx.db.patch(existingPlace._id, place);
        updated++;
      } else {
        // Create
        await ctx.db.insert("spots", place);
        created++;
      }
    }

    // Delete places
    for (const existingPlace of existingPlaces) {
      if (!incomingSlugs.has(existingPlace.slug)) {
        await ctx.db.delete(existingPlace._id);
        deleted++;
      }
    }

    return { created, updated, deleted };
  },
});
