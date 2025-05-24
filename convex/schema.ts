import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  spots: defineTable({
    name: v.string(),
    slug: v.string(),
    address: v.string(),
    neighborhood: v.optional(v.string()),
    google_places_id: v.optional(v.string()),
    map_iframe_url: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
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
    // ISO8601 date string of last admin verification; empty string indicates not yet verified.
    date_last_verified_admin: v.string(),
    is_published: v.boolean(),
  })
  .index("by_is_published", ["is_published"])
  .index("by_slug", ["slug"])
  .searchIndex("search_name", { searchField: "name" }),
});
