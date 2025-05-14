import { Hono } from 'hono'
import type { Context } from 'hono'
import type { FC } from 'hono/jsx'
import { ConvexHttpClient } from 'convex/browser'
import Layout from './components/Layout'
import SpotCard from './components/SpotCard'
import SpotDetail from './components/SpotDetail'
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

const Home: FC<HomeProps> = ({ spots, searchParam, wifiQualityParam, foodAvailableParam, crowdLevelParam }: HomeProps) => {
  return (
    <Layout>
      <h2>Remote Work Spots in Austin</h2>
      <p>Find the perfect spot to work remotely in Austin!</p>
      <form method="get" action="/" class="search-form">
        <input
          type="text"
          name="search"
          placeholder="Search by spot name..."
          defaultValue={searchParam || ''}
        />
        <select name="wifiQuality">
          <option value="">WiFi Quality</option>
          <option value="Excellent" selected={wifiQualityParam === 'Excellent'}>Excellent</option>
          <option value="Good" selected={wifiQualityParam === 'Good'}>Good</option>
        </select>
        <select name="crowdLevel">
          <option value="">Crowd Level</option>
          <option value="Quiet" selected={crowdLevelParam === 'Quiet'}>Quiet</option>
          <option value="Moderate" selected={crowdLevelParam === 'Moderate'}>Moderate</option>
        </select>
        <select name="foodAvailable">
          <option value="">Food Available</option>
          <option value="true" selected={foodAvailableParam === 'true'}>Yes</option>
          <option value="false" selected={foodAvailableParam === 'false'}>No</option>
        </select>
        <button type="submit">Search</button>
        {(searchParam || wifiQualityParam || foodAvailableParam || crowdLevelParam) && (
          <a href="/" class="clear-search">Clear Filters</a>
        )}
      </form>
      {spots.length === 0 && (
        <p class="no-results">No spots found matching your filters.</p>
      )}
      <div class="spot-list">
        {spots.map((spot: Doc<'spots'>) => (
          <SpotCard
            key={spot._id}
            slug={spot.slug}
            name={spot.name}
            neighborhood={spot.neighborhood}
            mainPhotoUrl={spot.main_photo_url}
            wifiQuality={spot.wifi_quality}
            foodAvailable={spot.food_available}
            crowdLevelTypical={spot.crowd_level_typical}
          />
        ))}
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
}

const SpotDetailPage: FC<SpotDetailPageProps> = ({ spot }) => {
  if (!spot) {
    return (
      <Layout>
        <h1>Spot Not Found</h1>
        <p>Sorry, we couldn't find the spot you're looking for.</p>
        <a href="/" class="back-link">← Back to Home</a>
      </Layout>
    )
  }

  return (
    <Layout>
      <SpotDetail spot={spot} />
      <a href="/" class="back-link">← Back to Home</a>
    </Layout>
  )
}

app.get('/spots/:slug', async (c) => {
  const slug = c.req.param('slug')
  const CONVEX_URL = c.env.CONVEX_URL
  const client = new ConvexHttpClient(CONVEX_URL)
  const spot = await client.query(api.spots.getSpotBySlug, { slug })
  return c.render(<SpotDetailPage spot={spot} />)
})

export default app