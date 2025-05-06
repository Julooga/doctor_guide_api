import { swaggerUI } from '@hono/swagger-ui'
import { handle } from 'hono/aws-lambda'
import hospital from './routes/hospital/hospital'
import pharamacy from './routes/pharamacy/pharamacy'
import app from './app'
import getHospitalData from './routes/hospital/getHospitalData'
import getPharmacyData from './routes/pharamacy/getPharmacyData'
import { pharmacyPoiSchema } from './routes/pharamacy/schema'
import { HospitalPoiSchema } from './routes/hospital/schema'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.openapi(hospital, async (c) => {
  const query = c.req.valid('query')
  const data = await getHospitalData<HospitalPoiSchema>({
    TableName: 'Hospital-safetydata',
    query
  })

  return c.json({
    success: true,
    data
  })
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.openapi(pharamacy, async (c) => {
  const query = c.req.valid('query')
  const data = await getPharmacyData<pharmacyPoiSchema>({
    TableName: 'Pharamacy-safetydata',
    query
  })

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
