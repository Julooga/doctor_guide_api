import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from 'react-router'

import type { Route } from './+types/root'
import './app.css'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
  }
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

const getError = (error: unknown) => {
  if (import.meta.env.DEV && error && error instanceof Error) {
    return {
      message: 'Oops!',
      details: error.message,
      stack: error.stack
    }
  }

  if (isRouteErrorResponse(error) && error.status === 404) {
    return {
      message: '404',
      details: 'The requested page could not be found.'
    }
  }

  if (isRouteErrorResponse(error)) {
    return {
      message: 'Error',
      details: error.statusText || 'An unexpected error occurred.'
    }
  }

  return {
    message: 'Oops!',
    details: 'An unexpected error occurred.'
  }
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { message, details, stack } = getError(error)

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
