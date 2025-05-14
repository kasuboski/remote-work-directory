import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  spots: defineTable({
    name: v.string(),
    address: v.string(),
    neighborhood: v.union(v.string(), v.null()),
    google_places_id: v.union(v.string(), v.null()),
    map_iframe_url: v.union(v.string(), v.null()),
    latitude: v.union(v.number(), v.null()),
    longitude: v.union(v.number(), v.null()),
    wifi_quality: v.union(
      v.literal("Excellent"),
      v.literal("Good"),
      v.literal("Fair"),
      v.literal("Poor"),
      v.literal("Unknown")
    ),
    wifi_notes: v.union(v.string(), v.null()),
    food_available: v.boolean(),
    food_notes: v.union(v.string(), v.null()),
    crowd_level_typical: v.union(
      v.literal("Quiet"),
      v.literal("Moderate"),
      v.literal("Busy"),
      v.literal("Varies"),
      v.literal("Unknown")
    ),
    crowd_notes: v.union(v.string(), v.null()),
    power_outlets: v.union(
      v.literal("Plenty"),
      v.literal("Some"),
      v.literal("Few"),
      v.literal("None"),
      v.literal("Unknown")
    ),
    other_amenities_text: v.union(v.string(), v.null()),
    description_admin: v.union(v.string(), v.null()),
    main_photo_url: v.union(v.string(), v.null()),
    hours_of_operation_text: v.union(v.string(), v.null()),
    website_url: v.union(v.string(), v.null()),
    phone_number: v.union(v.string(), v.null()),
    // ISO8601 date string of last admin verification; empty string indicates not yet verified.
    date_last_verified_admin: v.string(),
    is_published: v.boolean(),
  })
  .index("by_is_published", ["is_published"]),
});
