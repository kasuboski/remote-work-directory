import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import Layout from './components/Layout'

const app = new Hono()

const Home: FC = () => {
  return (
    <Layout>
      <div>
        <h2>Welcome to Austin Remote Work Spot Finder</h2>
        <p>Find the perfect spot to work remotely in Austin, TX.</p>
      </div>
    </Layout>
  )
}

app.get('/', (c) => {
  return c.html(<Home />)
})

export default app