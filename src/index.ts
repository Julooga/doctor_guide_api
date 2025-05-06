import { swaggerUI } from '@hono/swagger-ui'
import { handle } from 'hono/aws-lambda'
import hospital from './routes/hospital/hospital'
import pharamacy from './routes/pharamacy/pharamacy'
import app from './app'
import getHospitalData from './routes/hospital/getHospitalData'
import getPharmacyData from './routes/pharamacy/getPharmacyData'
import { HospitalPoiSchema } from './routes/hospital/schema'
import { PharmacyPoiModel } from './routes/pharamacy/schema'

app.openapi(hospital, async (c) => {
  const query = await c.req.valid('query')
  const data = (await getHospitalData({
    TableName: 'Hospital-safetydata',
    query
  })) as HospitalPoiSchema[]

  return c.json({
    success: true,
    data
  })
})

app.openapi(pharamacy, async (c) => {
  const query = await c.req.valid('query')
  const data = (await getPharmacyData({
    TableName: 'Pharamacy-safetydata',
    query
  })) as PharmacyPoiModel[]

  return c.json({
    success: true,
    data
  })
})

app.doc31('/docs', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Doctor Guide Api'
  }
})
app.get('/', swaggerUI({ url: '/docs' }))

export const handler = handle(app)
export default app
