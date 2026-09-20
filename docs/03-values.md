# 03. 값 다루기 — watch / getValues / setValue / reset / trigger

## watch vs getValues

```tsx
const nickname = watch('nickname')  // 구독 → 값이 바뀌면 리렌더
getValues('nickname')               // 단발 조회 → 리렌더 없음
```

### 판단 기준

> **값이 `return (...)` 안에 등장하면 `watch`, 아니면 `getValues`.**

| 필요한 곳 | 방법 |
| --- | --- |
| 제출할 때만 | `handleSubmit` 의 `data` |
| 이벤트 핸들러 안에서만 | `getValues` |
| 화면에 그려야 함 (미리보기, 조건부 필드, 합계, 버튼 활성화) | `watch` |

### watch 는 상태 관리가 아니다

상태는 `watch` 유무와 무관하게 **RHF 가 항상 관리**한다.
`watch` 는 그 값을 React 렌더에 꺼내오는 **읽기 전용 구독 창구**다. `useState` 로 치면 `count`(값) 쪽이지 `setCount` 가 아니다.

값이 바뀔 때 부수효과만 필요하고 화면에 그릴 필요가 없다면 `register` 의 `onChange` 를 쓰면 리렌더가 없다.

## setValue

```tsx
setValue('address', '서울...', {shouldDirty: true, shouldValidate: true})
```

- 옵션을 안 주면 **값만 바뀌고 dirty 표시도 재검증도 안 된다**
- 주소검색 등 코드로 값을 주입할 때는 보통 둘 다 켠다
- DOM 을 직접 고치면 RHF 가 모르므로, 코드로 값을 바꿀 땐 반드시 `setValue`

## reset

| 호출 | 동작 |
| --- | --- |
| `reset()` | `defaultValues` 로 되돌림 |
| `reset(값)` | 그 값으로 채우고 **그 값을 새 기준으로 삼음** → `isDirty: false`, `dirtyFields: {}` |

수정 화면에서 서버 데이터를 불러온 뒤 `reset(data)` 하는 것이 표준 패턴.

## trigger — 수동 검증

```tsx
await trigger('passwordConfirm')   // 그 필드만
await trigger(['a', 'b'])          // 여러 필드
await trigger()                    // 전체
```

- `errors` 를 갱신하고 **통과 여부를 boolean 으로 반환**
- `mode` 는 자동 검증 타이밍, `trigger` 는 **수동 검증 버튼**

### 02 의 숙제 해결

```tsx
register('password', {
    onChange: () => {
        if (getValues('passwordConfirm')) trigger('passwordConfirm')
    },
})

// 대안: 확인 필드에 deps 를 건다
register('passwordConfirm', {deps: ['password']})
```

#### 확인 방법 (mode 기본값 onSubmit 기준)

1. 비밀번호 `aaa` → 2. 확인 `aaa` (에러 없음) → 3. 비밀번호를 `aaaX` 로 수정
4. **제출하지 않았는데** 확인 칸에 `비밀번호가 일치하지 않습니다` 가 즉시 표시됨

`onChange` 를 지우면 제출 전까지 조용하다 → 02 의 문제가 그대로 재현된다.

### 또 하나의 용도 — 단계 이동 판정

```tsx
const ok = await trigger(['name', 'email'])
if (ok) setStep(2)
```

## 변경 추적

- `isDirty` — 기준값과 하나라도 다른가
- `dirtyFields` — 어떤 필드가 바뀌었나
- 기준값은 `defaultValues`, 또는 마지막 `reset(값)` 의 값

## 실측 (렌더 횟수, StrictMode 라 실제 렌더당 +2)

| 조작 | 결과 |
| --- | --- |
| 한 글자 입력 (watch 구독 중) | 렌더 +1 |
| getValues 버튼 클릭 | 렌더 변화 없음 |
| setValue 2회 | dirtyFields 에 해당 필드 추가 |
| reset(불러온 값) | isDirty false, dirtyFields {} |
