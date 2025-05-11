import { handle } from 'hono/aws-lambda'
import app from '@/app'
import 'dotenv/config'
import 'zod-openapi/extend'

import hospitalRouter from '@/routes/hospital'
import pharamacyRouter from '@/routes/pharamacy'

app.route('/hospital', hospitalRouter)
app.route('/pharamacy', pharamacyRouter)

export const handler = handle(app)
export default app
