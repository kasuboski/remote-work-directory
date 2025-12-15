import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";
import { Doc } from "../convex/_generated/dataModel";

// Load environment variables from .env.local and .env
// This is needed because the script runs outside the Cloudflare Workers context
// where CONVEX_URL is normally injected via wrangler
dotenv.config({ path: ".env.local" });
dotenv.config();

const SPOTS_DIR = path.join(process.cwd(), "content", "spots");

// Map database fields to markdown headings
const FIELD_TO_HEADING: { [K in keyof Doc<"spots">]?: string } = {
  wifi_notes: "Wifi Notes",
  food_notes: "Food Notes",
  crowd_notes: "Crowd Notes",
  other_amenities_text: "Other Amenities",
  hours_of_operation_text: "Hours of Operation",
};

// Fields that should go in frontmatter
const FRONTMATTER_FIELDS: (keyof Doc<"spots">)[] = [
  "name",
  "slug",
  "address",
  "neighborhood",
  "google_places_id",
  "wifi_quality",
  "food_available",
  "crowd_level_typical",
  "power_outlets",
  "main_photo_url",
  "website_url",
  "phone_number",
  "date_last_verified_admin",
  "is_published",
];

function generateMarkdown(spot: Doc<"spots">): string {
  const lines: string[] = [];

  // Generate frontmatter
  lines.push("---");
  for (const field of FRONTMATTER_FIELDS) {
    const value = spot[field];
    // Always include the field, even if it's an empty string or undefined
    // This ensures round-trip consistency with the database
    if (typeof value === "string") {
      // Escape quotes in strings
      const escaped = value.replace(/"/g, '\\"');
      lines.push(`${field}: "${escaped}"`);
    } else if (typeof value === "boolean") {
      lines.push(`${field}: ${value}`);
    } else if (value === undefined) {
      // For optional fields that are undefined, use empty string
      lines.push(`${field}: ""`);
    } else {
      lines.push(`${field}: ${value}`);
    }
  }
  lines.push("---");
  lines.push("");

  // Add description_admin as general content
  if (spot.description_admin) {
    lines.push(spot.description_admin.trim());
    lines.push("");
  }

  // Add sections based on field-to-heading mapping
  // Only include sections that have actual content (not empty strings)
  for (const [field, heading] of Object.entries(FIELD_TO_HEADING)) {
    const value = spot[field as keyof Doc<"spots">];
    if (value && typeof value === "string" && value.trim().length > 0) {
      lines.push(`## ${heading}`);
      lines.push(value.trim());
      lines.push("");
    }
  }

  return lines.join("\n");
}

async function exportSpots() {
  console.log("Starting spots export...");

  const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) {
    console.error(
      "Error: VITE_CONVEX_URL or CONVEX_URL environment variable is not set"
    );
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  // Ensure the spots directory exists
  if (!fs.existsSync(SPOTS_DIR)) {
    console.log(`Creating content directory: ${SPOTS_DIR}`);
    fs.mkdirSync(SPOTS_DIR, { recursive: true });
  }

  // Fetch all spots from Convex
  console.log("Fetching spots from Convex...");
  const spots = await client.query(api.spots.getSpots);
  console.log(`Found ${spots.length} spots in database`);

  if (spots.length === 0) {
    console.log("No spots to export.");
    return;
  }

  // Generate markdown file for each spot
  let exported = 0;
  for (const spot of spots) {
    const filename = `${spot.slug}.md`;
    const filepath = path.join(SPOTS_DIR, filename);
    const markdown = generateMarkdown(spot);

    fs.writeFileSync(filepath, markdown, "utf-8");
    console.log(`Exported: ${spot.name} -> ${filename}`);
    exported++;
  }

  console.log(`\n✓ Export complete! Created ${exported} markdown file(s) in ${SPOTS_DIR}`);
}

exportSpots().catch(console.error);
