import type { FC, PropsWithChildren } from 'hono/jsx'

interface LayoutProps extends PropsWithChildren {
  title?: string;
  currentPath?: string;
}

const Layout: FC<LayoutProps> = ({ children, title, currentPath }) => {
  const pageTitle = title || 'Austin Remote Work Spot Finder';
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="/static/styles.css" />
        <link rel="stylesheet" href="/static/SpotDetail.css" />
        <link rel="stylesheet" href="/static/SuggestSpot.css" />
      </head>
      <body>
        <header>
          <a href="/" className="site-title-link">
            <h1>Austin Remote Work Spot Finder</h1>
          </a>
          <nav>
            {/* Example of using currentPath for active link styling */}
            <a href="/suggest" className={`suggest-spot-btn ${currentPath === '/suggest' ? 'active' : ''}`}>Suggest a Spot</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p> {new Date().getFullYear()} Austin Remote Work Spot Finder. Happy WFH-away-from-home!</p>
        </footer>
      </body>
    </html>
  )
}

export default Layout
