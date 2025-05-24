import { Hono } from 'hono'
import type { Context } from 'hono'
import type { FC } from 'hono/jsx'
import { ConvexHttpClient } from 'convex/browser'
import Layout from './components/Layout'
import SpotCard from './components/SpotCard'
import SpotDetail from './components/SpotDetail'
import SuggestSpotPage from './components/SuggestSpotPage'
import type { Doc } from '../convex/_generated/dataModel'
import { api } from '../convex/_generated/api'

// Types for filter values
type WifiQuality = Doc<'spots'>['wifi_quality']
type CrowdLevel = Doc<'spots'>['crowd_level_typical']

const app = new Hono<{ Bindings: CloudflareBindings }>()

interface HomeProps {
  spots: Doc<'spots'>[]
  searchParam?: string
  wifiQualityParam?: string
  foodAvailableParam?: string
  crowdLevelParam?: string
}

const Home: FC<HomeProps> = ({ spots, searchParam, wifiQualityParam, foodAvailableParam, crowdLevelParam }) => {
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
              value={searchParam || ''}
              class="search-input"
            />
            <button type="submit" class="search-btn">Search</button>
          </form>
        </div>
      </section>
      <section class="filter-bar">
        <form method="get" action="/" class="container filter-container">
          <input type="hidden" name="search" value={searchParam || ''} />
          <div class="filter-group">
            <label class="filter-label" for="wifiQuality">WiFi Quality</label>
            <select 
              id="wifiQuality" 
              name="wifiQuality" 
              class="filter-select" 
              onchange="this.form.submit()"
            >
              <option value="" selected={!wifiQualityParam}>Any</option>
              <option value="Excellent" selected={wifiQualityParam === 'Excellent'}>Excellent</option>
              <option value="Good" selected={wifiQualityParam === 'Good'}>Good</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label" for="crowdLevel">Crowd Level</label>
            <select 
              id="crowdLevel" 
              name="crowdLevel" 
              class="filter-select" 
              onchange="this.form.submit()"
            >
              <option value="" selected={!crowdLevelParam}>Any</option>
              <option value="Quiet" selected={crowdLevelParam === 'Quiet'}>Quiet</option>
              <option value="Moderate" selected={crowdLevelParam === 'Moderate'}>Moderate</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label" for="foodAvailable">Food Available</label>
            <select 
              id="foodAvailable" 
              name="foodAvailable" 
              class="filter-select" 
              onchange="this.form.submit()"
            >
              <option value="" selected={!foodAvailableParam}>Any</option>
              <option value="true" selected={foodAvailableParam === 'true'}>Yes</option>
              <option value="false" selected={foodAvailableParam === 'false'}>No</option>
            </select>
          </div>
          {(searchParam || wifiQualityParam || foodAvailableParam || crowdLevelParam) && (
            <a href="/" class="clear-filters">Clear Filters</a>
          )}
        </form>
      </section>
      <div class="main-content container">
        <div class="results-header">
          <div class="results-count">{spots.length} Spots Found</div>
          {(searchParam || wifiQualityParam || foodAvailableParam || crowdLevelParam) && (
            <a href="/" class="clear-filters">Clear Filters</a>
          )}
        </div>
        <table class="spots-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Neighborhood</th>
              <th>WiFi</th>
              <th>Food</th>
              <th>Crowd</th>
            </tr>
          </thead>
          <tbody>
            {spots.map((spot) => (
              <tr key={spot._id} onclick={`location.href='/spots/${spot.slug}'`}>
                <td><img src={spot.main_photo_url || ''} alt={spot.name} class="spot-photo" /></td>
                <td><div class="spot-name">{spot.name}</div></td>
                <td><div class="spot-neighborhood">{spot.neighborhood}</div></td>
                <td><span class={`indicator-badge wifi-${spot.wifi_quality.toLowerCase()}`}>{spot.wifi_quality}</span></td>
                <td><span class={`indicator-badge food-${spot.food_available ? 'yes' : 'no'}`}>{spot.food_available ? 'Yes' : 'No'}</span></td>
                <td><span class={`indicator-badge crowd-${spot.crowd_level_typical.toLowerCase()}`}>{spot.crowd_level_typical}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

// Helper to parse and build filter args
type FilterArgs = { search?: string; wifiQuality?: WifiQuality; foodAvailable?: boolean; crowdLevel?: CrowdLevel }
type RawParams = { searchParam?: string; wifiQualityParam?: string; foodAvailableParam?: string; crowdLevelParam?: string }
function parseFilters(c: Context<{ Bindings: CloudflareBindings }>): { queryArgs: Partial<FilterArgs>; rawParams: RawParams } {
  const searchParam = c.req.query('search')
  const wifiQualityParam = c.req.query('wifiQuality')
  const crowdLevelParam = c.req.query('crowdLevel')
  const foodAvailableParam = c.req.query('foodAvailable')
  const search = searchParam && searchParam.trim() ? searchParam.trim() : undefined
  const wifiQuality = wifiQualityParam && wifiQualityParam !== '' ? (wifiQualityParam as WifiQuality) : undefined
  const crowdLevel = crowdLevelParam && crowdLevelParam !== '' ? (crowdLevelParam as CrowdLevel) : undefined
  const foodAvailable =
    foodAvailableParam === 'true'
      ? true
      : foodAvailableParam === 'false'
      ? false
      : undefined
  const queryArgs: Partial<FilterArgs> = {}
  if (search) queryArgs.search = search
  if (wifiQuality) queryArgs.wifiQuality = wifiQuality
  if (foodAvailable !== undefined) queryArgs.foodAvailable = foodAvailable
  if (crowdLevel) queryArgs.crowdLevel = crowdLevel
  return { queryArgs, rawParams: { searchParam, wifiQualityParam, foodAvailableParam, crowdLevelParam } }
}

app.get('/', async (c) => {
  const client = new ConvexHttpClient(c.env.CONVEX_URL)
  const { queryArgs, rawParams } = parseFilters(c)
  const spots = await client.query(api.spots.listPublishedSpots, queryArgs)
  return c.render(<Home spots={spots} {...rawParams} />)
})

interface SpotDetailPageProps {
  spot: Doc<'spots'> | null
  env: {
    GOOGLE_MAPS_API_KEY: string
  }
}

const SpotDetailPage: FC<SpotDetailPageProps> = ({ spot, env }) => {
  if (!spot) {
    return (
      <Layout>
        <h1>Spot Not Found</h1>
        <p>Sorry, we couldn't find the spot you're looking for.</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <SpotDetail spot={spot} env={env} />
    </Layout>
  )
}

app.get('/spots/:slug', async (c) => {
  const slug = c.req.param('slug')
  const CONVEX_URL = c.env.CONVEX_URL
  const client = new ConvexHttpClient(CONVEX_URL)
  const spot = await client.query(api.spots.getSpotBySlug, { slug })
  return c.render(<SpotDetailPage spot={spot} env={{ GOOGLE_MAPS_API_KEY: c.env.GOOGLE_MAPS_API_KEY }} />)
})

// Route for Suggest a Spot page
app.get('/suggest', (c) => {
  return c.render(
    <Layout title="Suggest a New Spot | Austin Remote Work Spot Finder" currentPath="/suggest">
      <SuggestSpotPage />
    </Layout>
  )
})

export default app