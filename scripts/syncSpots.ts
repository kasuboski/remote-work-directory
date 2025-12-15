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

// Load environment variables
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

    parsedContent.description_admin = generalContent;

    return { ...frontmatter, ...parsedContent } as ParsedSpot;
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

  if (isDryRun) {
    console.log("\n--- Dry Run Summary ---");
    const existingSpots = await client.query(api.spots.getSpots);
    const existingSlugs = new Set(existingSpots.map((p) => p.slug));
    const incomingSlugs = new Set(spots.map((p) => p.slug));

    const toCreate = spots.filter((p) => !existingSlugs.has(p.slug));
    const toUpdate = spots.filter((p) => existingSlugs.has(p.slug));
    const toDelete = existingSpots.filter((p) => !incomingSlugs.has(p.slug));

    console.log(`\nTo be created: ${toCreate.length}`);
    toCreate.forEach((p) => console.log(`  - ${p.name} (${p.slug})`));

    console.log(`\nTo be updated: ${toUpdate.length}`);
    toUpdate.forEach((p) => console.log(`  - ${p.name} (${p.slug})`));

    console.log(`\nTo be deleted: ${toDelete.length}`);
    toDelete.forEach((p) => console.log(`  - ${p.name} (${p.slug})`));

    console.log("\n--- End Dry Run ---");
    return;
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
