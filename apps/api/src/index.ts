import 'dotenv/config'
import { handle } from 'hono/aws-lambda'
import app from '@/app'
import 'zod-openapi/extend'

import hospitalRouter from '@/routes/hospital'
import pharamacyRouter from '@/routes/pharamacy'
import medRouter from '@/routes/medical'
import swaggerRouter from './routes/swagger'

app.route('/', swaggerRouter)
app.route('/hospital', hospitalRouter)
app.route('/pharamacy', pharamacyRouter)
app.route('/med', medRouter)

export const handler = handle(app)
export default app
