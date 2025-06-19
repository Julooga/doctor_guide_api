import { LambdaInfra } from './recipe/aws/LambdaInfra'

// lambda 인프라 생성
export const { apiEndpoint } = new LambdaInfra('doctor-guide-api-lambda', {
  pathname: '../../apps/api/dist',
  endpoints: [
    {
      method: 'GET',
      path: '/'
    },
    {
      method: 'GET',
      path: '/docs'
    },
    {
      method: 'GET',
      path: '/hospital'
    },
    {
      method: 'GET',
      path: '/pharmacy'
    },
    {
      method: 'POST',
      path: '/med/chat'
    },
    {
      method: 'POST',
      path: '/med/chat/stream'
    },
    {
      method: 'POST',
      path: '/med/summarize'
    }
  ]
})
