import { swaggerUI } from '@hono/swagger-ui'
import { Hono } from 'hono'
import { openAPISpecs } from 'hono-openapi'
import { version } from '../../package.json'
import app from '@/app'

const swaggerRouter = new Hono()

swaggerRouter.get('/', swaggerUI({ url: '/docs' }))

const getServers = (profile: 'local' | 'real') => {
  if (profile === 'local') {
    return [{ url: '/' }]
  }

  return [
    {
      url: 'https://s92t9ee2c1.execute-api.ap-northeast-2.amazonaws.com'
    }
  ]
}

swaggerRouter.get(
  '/docs',
  openAPISpecs(app, {
    documentation: {
      info: {
        version,
        title: 'Doctor Guide Api'
      },
      servers: getServers(process.env.PROFILE as 'local' | 'real')
    }
  })
)

export default swaggerRouter
