import { Hono } from "hono";
import type { Context } from "hono";
import type { FC } from "hono/jsx";
import { ConvexHttpClient } from "convex/browser";
import Layout from "./components/Layout";
import SpotDetail from "./components/SpotDetail";
import SuggestSpotPage from "./components/SuggestSpotPage";
import type { Doc } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";

// Types for filter values
type WifiQuality = Doc<"spots">["wifi_quality"];
type CrowdLevel = Doc<"spots">["crowd_level_typical"];

const app = new Hono<{ Bindings: CloudflareBindings }>();

interface HomeProps {
  spots: Doc<"spots">[];
  searchParam?: string;
  wifiQualityParam?: string;
  foodAvailableParam?: string;
  crowdLevelParam?: string;
}

const Home: FC<HomeProps> = ({
  spots,
  searchParam,
  wifiQualityParam,
  foodAvailableParam,
  crowdLevelParam,
}) => {
  return (
    <Layout>
      <section class="search-section">
        <div class="search-container">
          <div class="search-title">Search Remote Work Spots</div>
          <form method="get" action="/" class="search-input-group">
            <input
              type="search"
              name="search"
              placeholder="Search by spot name..."
              value={searchParam || ""}
              class="search-input"
            />
            <button type="submit" class="search-btn">
              Search
            </button>
          </form>
        </div>
      </section>
      <section class="filter-bar">
        <form method="get" action="/" class="container filter-container">
          <input type="hidden" name="search" value={searchParam || ""} />
          <div class="filter-group">
            <label class="filter-label" for="wifiQuality">
              WiFi Quality
            </label>
            <select
              id="wifiQuality"
              name="wifiQuality"
              class="filter-select"
              onchange="this.form.submit()"
            >
              <option value="" selected={!wifiQualityParam}>
                Any
              </option>
              <option
                value="Excellent"
                selected={wifiQualityParam === "Excellent"}
              >
                Excellent
              </option>
              <option value="Good" selected={wifiQualityParam === "Good"}>
                Good
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label" for="crowdLevel">
              Crowd Level
            </label>
            <select
              id="crowdLevel"
              name="crowdLevel"
              class="filter-select"
              onchange="this.form.submit()"
            >
              <option value="" selected={!crowdLevelParam}>
                Any
              </option>
              <option value="Quiet" selected={crowdLevelParam === "Quiet"}>
                Quiet
              </option>
              <option
                value="Moderate"
                selected={crowdLevelParam === "Moderate"}
              >
                Moderate
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label" for="foodAvailable">
              Food Available
            </label>
            <select
              id="foodAvailable"
              name="foodAvailable"
              class="filter-select"
              onchange="this.form.submit()"
            >
              <option value="" selected={!foodAvailableParam}>
                Any
              </option>
              <option value="true" selected={foodAvailableParam === "true"}>
                Yes
              </option>
              <option value="false" selected={foodAvailableParam === "false"}>
                No
              </option>
            </select>
          </div>
          {(searchParam ||
            wifiQualityParam ||
            foodAvailableParam ||
            crowdLevelParam) && (
            <a href="/" class="clear-filters">
              Clear Filters
            </a>
          )}
        </form>
      </section>
      <div class="main-content container">
        <div class="results-header">
          <div class="results-count">{spots.length} Spots Found</div>
          {(searchParam ||
            wifiQualityParam ||
            foodAvailableParam ||
            crowdLevelParam) && (
            <a href="/" class="clear-filters">
              Clear Filters
            </a>
          )}
        </div>
        <table class="spots-table">
          <caption class="sr-only">
            {spots.length} remote work spots in Austin
            {(searchParam ||
              wifiQualityParam ||
              foodAvailableParam ||
              crowdLevelParam) &&
              " (filtered results)"}
          </caption>
          <thead>
            <tr>
              <th scope="col">Photo</th>
              <th scope="col">Name</th>
              <th scope="col">Neighborhood</th>
              <th scope="col">WiFi</th>
              <th scope="col">Food</th>
              <th scope="col">Crowd</th>
            </tr>
          </thead>
          <tbody>
            {spots.map((spot) => (
              <tr key={spot._id}>
                <td>
                  <img
                    src={spot.main_photo_url || ""}
                    alt={spot.name}
                    class="spot-photo"
                  />
                </td>
                <td>
                  <a href={`/spots/${spot.slug}`} class="spot-name-link">
                    {spot.name}
                  </a>
                </td>
                <td>
                  <div class="spot-neighborhood">{spot.neighborhood}</div>
                </td>
                <td>
                  <span
                    class={`indicator-badge wifi-${spot.wifi_quality.toLowerCase()}`}
                  >
                    {spot.wifi_quality}
                  </span>
                </td>
                <td>
                  <span
                    class={`indicator-badge food-${spot.food_available ? "yes" : "no"}`}
                  >
                    {spot.food_available ? "Yes" : "No"}
                  </span>
                </td>
                <td>
                  <span
                    class={`indicator-badge crowd-${spot.crowd_level_typical.toLowerCase()}`}
                  >
                    {spot.crowd_level_typical}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

// Helper to parse and build filter args
type FilterArgs = {
  search?: string;
  wifiQuality?: WifiQuality;
  foodAvailable?: boolean;
  crowdLevel?: CrowdLevel;
};
type RawParams = {
  searchParam?: string;
  wifiQualityParam?: string;
  foodAvailableParam?: string;
  crowdLevelParam?: string;
};
function parseFilters(c: Context<{ Bindings: CloudflareBindings }>): {
  queryArgs: Partial<FilterArgs>;
  rawParams: RawParams;
} {
  const searchParam = c.req.query("search");
  const wifiQualityParam = c.req.query("wifiQuality");
  const crowdLevelParam = c.req.query("crowdLevel");
  const foodAvailableParam = c.req.query("foodAvailable");
  const search =
    searchParam && searchParam.trim() ? searchParam.trim() : undefined;
  const wifiQuality =
    wifiQualityParam && wifiQualityParam !== ""
      ? (wifiQualityParam as WifiQuality)
      : undefined;
  const crowdLevel =
    crowdLevelParam && crowdLevelParam !== ""
      ? (crowdLevelParam as CrowdLevel)
      : undefined;
  const foodAvailable =
    foodAvailableParam === "true"
      ? true
      : foodAvailableParam === "false"
        ? false
        : undefined;
  const queryArgs: Partial<FilterArgs> = {};
  if (search) queryArgs.search = search;
  if (wifiQuality) queryArgs.wifiQuality = wifiQuality;
  if (foodAvailable !== undefined) queryArgs.foodAvailable = foodAvailable;
  if (crowdLevel) queryArgs.crowdLevel = crowdLevel;
  return {
    queryArgs,
    rawParams: {
      searchParam,
      wifiQualityParam,
      foodAvailableParam,
      crowdLevelParam,
    },
  };
}

app.get("/", async (c) => {
  try {
    const client = new ConvexHttpClient(c.env.CONVEX_URL);
    const { queryArgs, rawParams } = parseFilters(c);
    const spots = await client.query(api.spots.listPublishedSpots, queryArgs);
    return c.render(<Home spots={spots} {...rawParams} />);
  } catch (error) {
    console.error("Error fetching spots:", error);
    c.status(500);
    return c.render(
      <Layout title="Error | Austin Remote Work Spot Finder">
        <div class="error-page">
          <h1>Oops! Something went wrong</h1>
          <p>We're having trouble loading the spots. Please try again later.</p>
          <a href="/" class="back-link">
            Try Again
          </a>
        </div>
      </Layout>,
    );
  }
});

interface SpotDetailPageProps {
  spot: Doc<"spots"> | null;
  env: {
    GOOGLE_MAPS_API_KEY: string;
  };
}

const SpotDetailPage: FC<SpotDetailPageProps> = ({ spot, env }) => {
  if (!spot) {
    return (
      <Layout>
        <h1>Spot Not Found</h1>
        <p>Sorry, we couldn't find the spot you're looking for.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <SpotDetail spot={spot} env={env} />
    </Layout>
  );
};

app.get("/spots/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const CONVEX_URL = c.env.CONVEX_URL;
    const client = new ConvexHttpClient(CONVEX_URL);
    const spot = await client.query(api.spots.getSpotBySlug, { slug });

    if (!spot) {
      c.status(404);
      return c.render(
        <Layout title="Spot Not Found | Austin Remote Work Spot Finder">
          <div class="error-page">
            <h1>Spot Not Found</h1>
            <p>Sorry, we couldn't find a spot with that name.</p>
            <a href="/" class="back-link">
              ← Back to all spots
            </a>
          </div>
        </Layout>,
      );
    }

    return c.render(
      <SpotDetailPage
        spot={spot}
        env={{ GOOGLE_MAPS_API_KEY: c.env.GOOGLE_MAPS_API_KEY }}
      />,
    );
  } catch (error) {
    console.error("Error fetching spot:", error);
    c.status(500);
    return c.render(
      <Layout title="Error | Austin Remote Work Spot Finder">
        <div class="error-page">
          <h1>Oops! Something went wrong</h1>
          <p>We're having trouble loading this spot. Please try again later.</p>
          <a href="/" class="back-link">
            ← Back to all spots
          </a>
        </div>
      </Layout>,
    );
  }
});

// GET /suggest - Show the suggestion form
app.get("/suggest", (c) => {
  return c.render(
    <Layout title="Suggest a New Spot | Austin Remote Work Spot Finder" currentPath="/suggest">
      <SuggestSpotPage />
    </Layout>,
  );
});

// POST /suggest - Handle form submission
app.post("/suggest", async (c) => {
  try {
    const formData = await c.req.formData();

    // === HELPER: Safely extract and normalize form field ===
    const normalizeField = (
      fieldName: string,
    ): string | undefined => {
      const value = formData.get(fieldName);
      if (value === null) return undefined;
      const trimmed = value.toString().trim();
      return trimmed === "" ? undefined : trimmed;
    };

    // === EXTRACT AND NORMALIZE ALL FIELDS ===
    const spotName = normalizeField("spotName");
    const address = normalizeField("spotAddress");
    const neighborhood = normalizeField("spotNeighborhood");
    const reason = normalizeField("reason");
    const wifiNotes = normalizeField("wifiNotes");
    const foodNotes = normalizeField("foodNotes");
    const crowdNotes = normalizeField("crowdNotes");
    const powerNotes = normalizeField("powerNotes");
    const otherNotes = normalizeField("otherNotes");
    const suggesterName = normalizeField("suggesterName");
    const suggesterEmail = normalizeField("suggesterEmail");

    // === FRONTEND VALIDATION ===

    // 1. Validate required field: spotName
    if (!spotName) {
      return c.render(
        <Layout
          title="Suggest a New Spot | Austin Remote Work Spot Finder"
          currentPath="/suggest"
        >
          <SuggestSpotPage error="Spot name is required. Please provide the name of the location." />
        </Layout>,
      );
    }

    // 2. Validate spotName length (max 200 chars)
    if (spotName.length > 200) {
      return c.render(
        <Layout
          title="Suggest a New Spot | Austin Remote Work Spot Finder"
          currentPath="/suggest"
        >
          <SuggestSpotPage
            error={`Spot name is too long (${spotName.length} characters). Please keep it under 200 characters.`}
          />
        </Layout>,
      );
    }

    // 3. Validate optional text field lengths (max 500 chars each)
    const textFields = [
      { name: "Address", value: address, max: 500 },
      { name: "Neighborhood", value: neighborhood, max: 500 },
      { name: "Reason", value: reason, max: 500 },
      { name: "WiFi notes", value: wifiNotes, max: 500 },
      { name: "Food notes", value: foodNotes, max: 500 },
      { name: "Crowd notes", value: crowdNotes, max: 500 },
      { name: "Power notes", value: powerNotes, max: 500 },
      { name: "Other notes", value: otherNotes, max: 500 },
    ];

    for (const field of textFields) {
      if (field.value && field.value.length > field.max) {
        return c.render(
          <Layout
            title="Suggest a New Spot | Austin Remote Work Spot Finder"
            currentPath="/suggest"
          >
            <SuggestSpotPage
              error={`${field.name} is too long (${field.value.length} characters). Please keep it under ${field.max} characters.`}
            />
          </Layout>,
        );
      }
    }

    // 4. Validate suggesterName length (max 100 chars)
    if (suggesterName && suggesterName.length > 100) {
      return c.render(
        <Layout
          title="Suggest a New Spot | Austin Remote Work Spot Finder"
          currentPath="/suggest"
        >
          <SuggestSpotPage
            error={`Your name is too long (${suggesterName.length} characters). Please keep it under 100 characters.`}
          />
        </Layout>,
      );
    }

    // 5. Validate suggesterEmail format and length
    if (suggesterEmail) {
      // Check max length (RFC 5321 limit)
      if (suggesterEmail.length > 254) {
        return c.render(
          <Layout
            title="Suggest a New Spot | Austin Remote Work Spot Finder"
            currentPath="/suggest"
          >
            <SuggestSpotPage
              error={`Email address is too long (${suggesterEmail.length} characters). Please use an email under 254 characters.`}
            />
          </Layout>,
        );
      }

      // Basic email format validation (RFC 5322 simplified)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(suggesterEmail)) {
        return c.render(
          <Layout
            title="Suggest a New Spot | Austin Remote Work Spot Finder"
            currentPath="/suggest"
          >
            <SuggestSpotPage error="Please provide a valid email address (e.g., name@example.com)." />
          </Layout>,
        );
      }

      // Reject obviously fake/test emails
      const suspiciousPatterns = [
        /test@test/i,
        /fake@fake/i,
        /example@example/i,
        /spam@spam/i,
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(suggesterEmail)) {
          return c.render(
            <Layout
              title="Suggest a New Spot | Austin Remote Work Spot Finder"
              currentPath="/suggest"
            >
              <SuggestSpotPage error="Please provide a real email address. Test/fake emails are not accepted." />
            </Layout>,
          );
        }
      }
    }

    // 6. Calculate total payload size (rough estimate)
    const totalSize = [
      spotName,
      address,
      neighborhood,
      reason,
      wifiNotes,
      foodNotes,
      crowdNotes,
      powerNotes,
      otherNotes,
      suggesterName,
      suggesterEmail,
    ].reduce((sum, val) => sum + (val ? val.length : 0), 0);

    // Reject overly large payloads (max 5KB total)
    if (totalSize > 5000) {
      return c.render(
        <Layout
          title="Suggest a New Spot | Austin Remote Work Spot Finder"
          currentPath="/suggest"
        >
          <SuggestSpotPage
            error={`Your submission is too large (${totalSize} characters). Please reduce the total amount of text to under 5000 characters.`}
          />
        </Layout>,
      );
    }

    // === ALL VALIDATIONS PASSED - SUBMIT TO CONVEX ===
    const client = new ConvexHttpClient(c.env.CONVEX_URL);

    await client.mutation(api.spots.submitSuggestion, {
      spot_name: spotName,
      address: address,
      neighborhood: neighborhood,
      reason: reason,
      wifi_notes: wifiNotes,
      food_notes: foodNotes,
      crowd_notes: crowdNotes,
      power_notes: powerNotes,
      other_notes: otherNotes,
      suggester_name: suggesterName,
      suggester_email: suggesterEmail,
    });

    return c.render(
      <Layout
        title="Thank You | Austin Remote Work Spot Finder"
        currentPath="/suggest"
      >
        <SuggestSpotPage success={true} />
      </Layout>,
    );
  } catch (error) {
    console.error("Error submitting suggestion:", error);

    // Check if it's a Convex validation error
    const errorMessage =
      error instanceof Error && error.message
        ? error.message
        : "Sorry, there was an error submitting your suggestion. Please try again.";

    return c.render(
      <Layout
        title="Suggest a New Spot | Austin Remote Work Spot Finder"
        currentPath="/suggest"
      >
        <SuggestSpotPage error={errorMessage} />
      </Layout>,
    );
  }
});

export default app;
