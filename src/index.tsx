import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import { ConvexHttpClient } from 'convex/browser'
import Layout from './components/Layout'
import SpotCard from './components/SpotCard'
import type { Doc } from '../convex/_generated/dataModel'
import { api } from '../convex/_generated/api'

const app = new Hono<{ Bindings: CloudflareBindings }>()

interface HomeProps {
  spots: Doc<'spots'>[];
}

const Home: FC<HomeProps> = ({ spots }) => {
  return (
    <Layout>
      <h2>Remote Work Spots in Austin</h2>
      <p>Find the perfect spot to work remotely in Austin!</p>
      <div class="spot-list">
        {spots.map((spot) => (
          <SpotCard
            key={spot._id}
            id={spot._id}
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
  const spots = await client.query(api.spots.listPublishedSpots)
  return c.render(<Home spots={spots} />)
})

export default app