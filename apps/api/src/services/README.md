# 서비스

- 비즈니스 로직을 담당하며, 데이터베이스 접근이나 외부 API 호출 등의 작업을 수행합니다.

```ts
export const getUserById = (id: string) => {
  // 실제로는 데이터베이스에서 사용자 정보를 조회합니다.
  return { id, name: '홍길동' }
}
```
