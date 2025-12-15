import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";
import { ParsedPlace, PlaceFrontmatter } from "./types";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config();

const PLACES_DIR = path.join(process.cwd(), "content", "places");

// Parse a single markdown file
function parseMarkdownFile(filePath: string): ParsedPlace | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const frontmatter = data as Partial<PlaceFrontmatter>;

    // Validate required fields
    if (!frontmatter.name || !frontmatter.slug) {
      console.warn(`Skipping ${filePath}: missing required frontmatter fields`);
      return null;
    }

    return {
      ...frontmatter,
      content: content.trim(),
    } as ParsedPlace;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

// Get all markdown files from the content directory
function getAllMarkdownFiles(): string[] {
  if (!fs.existsSync(PLACES_DIR)) {
    console.log(`Creating content directory: ${PLACES_DIR}`);
    fs.mkdirSync(PLACES_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(PLACES_DIR);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(PLACES_DIR, file));
}

// Main sync function
async function syncPlaces() {
  const isDryRun = process.argv.includes("--dry-run");
  console.log(isDryRun ? "Starting places sync (dry run)..." : "Starting places sync...");

  const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) {
    console.error(
      "Error: VITE_CONVEX_URL or CONVEX_URL environment variable is not set"
    );
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  const markdownFiles = getAllMarkdownFiles();
  console.log(`Found ${markdownFiles.length} markdown files`);

  const places: ParsedPlace[] = [];
  for (const filePath of markdownFiles) {
    const place = parseMarkdownFile(filePath);
    if (place) {
      places.push(place);
      console.log(`Parsed: ${place.name} (${place.slug})`);
    }
  }

  if (isDryRun) {
    console.log("\n--- Dry Run Summary ---");
    console.log(`Would sync ${places.length} places to Convex.`);
    // Here you could add more detailed dry-run logic,
    // such as fetching existing slugs and showing what would be created/updated/deleted.
    console.log("--- End Dry Run ---");
    return;
  }

  console.log(`\nSyncing ${places.length} places to Convex...`);

  try {
    const result = await client.mutation(api.places.syncPlaces, { places });
    console.log("Sync complete!");
    console.log(`  Created: ${result.created}`);
    console.log(`  Updated: ${result.updated}`);
    console.log(`  Deleted: ${result.deleted}`);
  } catch (error) {
    console.error("Error syncing places:", error);
    process.exit(1);
  }
}

syncPlaces().catch(console.error);
