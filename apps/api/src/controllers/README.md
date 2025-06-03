# 컨트롤러

- 요청을 받아 필요한 검증을 수행하고, 서비스 레이어를 호출하여 비즈니스 로직을 처리한 후, 응답을 반환합니다.

```ts
import { Context } from 'hono'
import { getUserById } from '../services/userService'

export const getUser = (c: Context) => {
  const id = c.req.param('id')
  const user = getUserById(id)
  return c.json(user)
}
```
