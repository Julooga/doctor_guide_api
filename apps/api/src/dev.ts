import 'dotenv/config'
import { serve } from '@hono/node-server'
import app from '@/index'

serve({ fetch: app.fetch, port: 8080 }, (info) => {
  console.log(`🚀 Server is running at http://localhost:${info.port}`)
  console.log('🔧 Environment variables:')
  console.log(`  AWS_PROFILE: ${process.env.AWS_PROFILE}`)
  console.log(`  AWS_REGION: ${process.env.AWS_REGION}`)
  console.log(`  PROFILE: ${process.env.PROFILE}`)
})
