import type { FC, PropsWithChildren } from 'hono/jsx'

interface LayoutProps extends PropsWithChildren {
  title?: string;
  currentPath?: string;
}

const Layout: FC<LayoutProps> = ({ children, title, currentPath }) => {
  const pageTitle = title || 'Austin Remote Work Spots';
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
        <div class="header">
          <div class="container header-content">
            <div class="logo"><a href="/" style="text-decoration: none; color: inherit;">Austin Remote Work Spots</a></div>
            <div class="tagline">Find the perfect spot to work remotely in Austin</div>
          </div>
        </div>
        <main>{children}</main>
        <footer class="footer">
          <div class="container">
            <div class="footer-content">
              <div class="footer-info">
                <h3><a href="/" style="text-decoration: none; color: inherit;">Austin Remote Work Spots</a></h3>
                <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
              </div>
              <div class="footer-cta">
                <p>Know a great spot we missed?</p>
                <a href="/suggest" class={`suggest-spot-btn ${currentPath === '/suggest' ? 'active' : ''}`}>Suggest a Spot</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

export default Layout
