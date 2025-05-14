import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import { ConvexHttpClient } from 'convex/browser'
import Layout from './components/Layout'
import SpotCard from './components/SpotCard'
import SpotDetail from './components/SpotDetail'
import type { Doc } from '../convex/_generated/dataModel'
import { api } from '../convex/_generated/api'

const app = new Hono<{ Bindings: CloudflareBindings }>()

interface HomeProps {
  spots: Doc<'spots'>[];
  search?: string;
}

const Home: FC<HomeProps> = ({ spots, search }) => {
  return (
    <Layout>
      <h2>Remote Work Spots in Austin</h2>
      <p>Find the perfect spot to work remotely in Austin!</p>
      <form method="get" action="/" class="search-form">
        <input
          type="text"
          name="search"
          placeholder="Search by spot name..."
          value={search || ''}
        />
        <button type="submit">Search</button>
        {search && <a href="/" class="clear-search">Clear Search</a>}
      </form>
      <div class="spot-list">
        {spots.map((spot) => (
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

app.get('/', async (c) => {
  const CONVEX_URL = c.env.CONVEX_URL
  const client = new ConvexHttpClient(CONVEX_URL)
  const search = c.req.query('search')
  const spots = await client.query(api.spots.listPublishedSpots, { search })
  return c.render(<Home spots={spots} search={search} />)
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