import type { FC, PropsWithChildren } from 'hono/jsx'

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Austin Remote Work Spot Finder</title>
        <link rel="stylesheet" href="/static/styles.css" />
        <link rel="stylesheet" href="/static/SpotDetail.css" />
      </head>
      <body>
        <header>
          <h1>Austin Remote Work Spot Finder</h1>
          <nav>
            <a href="/">Home</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>© {new Date().getFullYear()} Austin Remote Work Spot Finder</p>
        </footer>
      </body>
    </html>
  )
}

export default Layout
