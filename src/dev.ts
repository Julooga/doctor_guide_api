import { serve } from '@hono/node-server'
import app from '@/index'

serve({ fetch: app.fetch, port: 8080 }, (info) => {
  console.log(`🚀 Server is running at http://localhost:${info.port}`)
})
