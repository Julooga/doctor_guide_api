# 라우터

- HTTP 경로와 메서드를 정의하며, 해당 경로에 대한 요청을 처리할 핸들러(컨트롤러)를 연결합니다.

```ts
import { Hono } from 'hono'
import { getUser } from '@/controllers/userController'

const userRouter = new Hono()

userRouter.get('/users/:id', getUser)

export default userRouter
```
