import { fromIni } from '@aws-sdk/credential-providers'

export const credentials = fromIni({ profile: process.env.AWS_PROFILE })
