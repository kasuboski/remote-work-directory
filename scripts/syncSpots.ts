import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";
import { Doc } from "../convex/_generated/dataModel";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { Root, Content } from "mdast";
import readline from "readline";

// Load environment variables from .env.local and .env
// This is needed because the script runs outside the Cloudflare Workers context
// where CONVEX_URL is normally injected via wrangler
dotenv.config({ path: ".env.local" });
dotenv.config();

const SPOTS_DIR = path.join(process.cwd(), "content", "spots");

type ParsedSpot = Omit<Doc<"spots">, "_id" | "_creationTime">;

// Parse a single markdown file
function parseMarkdownFile(filePath: string): ParsedSpot | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const frontmatter = data as Partial<ParsedSpot>;

    // Validate required fields
    if (!frontmatter.name || !frontmatter.slug) {
      console.warn(`Skipping ${filePath}: missing required frontmatter fields`);
      return null;
    }

    const tree = unified().use(remarkParse).parse(content);

    const parsedContent: Partial<ParsedSpot> = {};
    let currentHeading: string | null = null;
    let generalContent = "";

    // Map markdown headings to database fields
    // TypeScript will error at compile-time if any field name is invalid (not in ParsedSpot)
    // ensuring this stays in sync with convex/schema.ts
    const headingMap: { [key: string]: keyof ParsedSpot } = {
      "Wifi Notes": "wifi_notes",
      "Food Notes": "food_notes",
      "Crowd Notes": "crowd_notes",
      "Other Amenities": "other_amenities_text",
      "Hours of Operation": "hours_of_operation_text",
    };

    for (const node of tree.children) {
      if (node.type === "heading" && node.depth === 2) {
        currentHeading = (node.children[0] as any).value;
      } else {
        if (currentHeading) {
          const key = headingMap[currentHeading];
          if (key) {
            parsedContent[key] = ((parsedContent[key] || "") + "\n" + nodeToString(node)).trim();
          }
        } else {
          generalContent = (generalContent + "\n" + nodeToString(node)).trim();
        }
      }
    }

    parsedContent.description_admin = generalContent || "";

    // Ensure all optional string fields default to empty string if not found
    // This matches the database schema where optional string fields are empty strings, not undefined
    const optionalStringFields: (keyof ParsedSpot)[] = [
      "neighborhood",
      "google_places_id",
      "wifi_notes",
      "food_notes",
      "crowd_notes",
      "other_amenities_text",
      "description_admin",
      "main_photo_url",
      "hours_of_operation_text",
      "website_url",
      "phone_number",
    ];

    const result = { ...frontmatter, ...parsedContent } as any;

    for (const field of optionalStringFields) {
      if (result[field] === undefined) {
        result[field] = "";
      }
    }

    return result as ParsedSpot;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

function nodeToString(node: Content): string {
  if ("value" in node) return node.value;
  if ("children" in node) return node.children.map(nodeToString).join("");
  return "";
}

// Get all markdown files from the content directory
function getAllMarkdownFiles(): string[] {
  if (!fs.existsSync(SPOTS_DIR)) {
    console.log(`Creating content directory: ${SPOTS_DIR}`);
    fs.mkdirSync(SPOTS_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(SPOTS_DIR);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(SPOTS_DIR, file));
}

// Prompt user for confirmation
function promptConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

// Main sync function
async function syncSpots() {
  const isDryRun = process.argv.includes("--dry-run");
  console.log(isDryRun ? "Starting spots sync (dry run)..." : "Starting spots sync...");

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

  const spots: ParsedSpot[] = [];
  for (const filePath of markdownFiles) {
    const spot = parseMarkdownFile(filePath);
    if (spot) {
      spots.push(spot);
      console.log(`Parsed: ${spot.name} (${spot.slug})`);
    }
  }

  // Calculate what changes will be made
  const existingSpots = await client.query(api.spots.getSpots);
  const existingSlugs = new Set(existingSpots.map((p) => p.slug));
  const incomingSlugs = new Set(spots.map((p) => p.slug));

  const toCreate = spots.filter((p) => !existingSlugs.has(p.slug));

  // Only count as "to update" if there are actual differences
  const toUpdate = spots.filter((p) => {
    if (!existingSlugs.has(p.slug)) return false;

    const existingSpot = existingSpots.find((s) => s.slug === p.slug);
    if (!existingSpot) return false;

    // Compare all fields except _id and _creationTime
    const allKeys = new Set([
      ...Object.keys(p),
      ...Object.keys(existingSpot).filter((k) => k !== "_id" && k !== "_creationTime"),
    ]);

    for (const key of allKeys) {
      const incomingValue = (p as any)[key];
      const existingValue = (existingSpot as any)[key];

      if (JSON.stringify(incomingValue) !== JSON.stringify(existingValue)) {
        return true; // Has differences
      }
    }

    return false; // No differences
  });

  const toDelete = existingSpots.filter((p) => !incomingSlugs.has(p.slug));

  if (isDryRun) {
    console.log("\n--- Dry Run Summary ---");
    console.log(`\nTo be created: ${toCreate.length}`);
    toCreate.forEach((p) => console.log(`  - ${p.name} (${p.slug})`));

    console.log(`\nTo be updated: ${toUpdate.length}`);
    toUpdate.forEach((p) => console.log(`  - ${p.name} (${p.slug})`));

    console.log(`\nTo be deleted: ${toDelete.length}`);
    toDelete.forEach((p) => console.log(`  - ${p.name} (${p.slug})`));

    console.log("\n--- End Dry Run ---");
    return;
  }

  // Show summary and prompt for confirmation if there are deletions
  console.log("\n--- Sync Summary ---");
  console.log(`To be created: ${toCreate.length}`);
  console.log(`To be updated: ${toUpdate.length}`);
  console.log(`To be deleted: ${toDelete.length}`);

  if (toDelete.length > 0) {
    console.log("\nSpots to be deleted:");
    toDelete.forEach((p) => console.log(`  - ${p.name} (${p.slug})`));

    const confirmed = await promptConfirmation(
      `\n⚠️  This will permanently delete ${toDelete.length} spot(s) from the database. Continue?`
    );

    if (!confirmed) {
      console.log("\nSync cancelled by user.");
      process.exit(0);
    }
  }

  console.log(`\nSyncing ${spots.length} spots to Convex...`);

  try {
    const result = await client.mutation(api.spots.syncSpots, { spots });
    console.log("Sync complete!");
    console.log(`  Created: ${result.created}`);
    console.log(`  Updated: ${result.updated}`);
    console.log(`  Deleted: ${result.deleted}`);
  } catch (error) {
    console.error("Error syncing spots:", error);
    process.exit(1);
  }
}

syncSpots().catch(console.error);
