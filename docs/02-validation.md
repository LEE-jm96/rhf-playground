# 02. 검증과 에러 / mode

## 핵심 3가지

> **무엇을 검사할지는 `register` 규칙, 결과는 `errors`, 언제 검사할지는 `mode`.**

### ① 규칙 걸기

```tsx
register('userId', {
    required: '아이디는 필수입니다',
    minLength: {value: 4, message: '4자 이상 입력하세요'},
    maxLength: {value: 12, message: '12자 이하로 입력하세요'},
    pattern: {value: /^[a-z0-9]+$/, message: '영문 소문자와 숫자만 가능합니다'},
})
```

- 숫자는 `min` / `max`
- 내장 규칙으로 안 되면 `validate` — **`true` 면 통과, 문자열이면 그게 에러 메시지**

```tsx
validate: {
    hasLetter: (v) => /[a-zA-Z]/.test(v) || '영문을 포함해야 합니다',
    hasNumber: (v) => /\d/.test(v) || '숫자를 포함해야 합니다',
}

// 다른 필드와 비교
validate: (v) => v === getValues('password') || '비밀번호가 일치하지 않습니다'
```

### ② 에러 꺼내 쓰기

규칙에 걸리면 **RHF 가 자동으로** `errors` 를 채운다. 직접 state 를 만들 필요가 없다.

```tsx
const {formState: {errors}} = useForm()

{errors.userId && <p className="error">{errors.userId.message}</p>}
```

```ts
errors.userId = {
    type: 'minLength',          // 걸린 규칙 이름 (validate 는 함수 이름)
    message: '4자 이상 입력하세요',
    ref: <input>,               // 포커스 이동에 사용
}
```

- 통과하면 키 자체가 **자동으로 사라진다** → `{errors.x && ...}` 한 줄로 표시/숨김이 끝난다.
- **필드당 에러는 하나**. `required → minLength/maxLength → pattern → validate` 순으로 검사하고 처음 걸린 것만 담는다.
  전부 받고 싶으면 `useForm({criteriaMode: 'all'})` → `errors.x.types`.

### ③ 언제 검증하나 — mode

`useForm({mode})` 로 정하며, **useForm 이 처음 만들어질 때만 읽힌다**(그래서 실습 화면은 `key` 로 폼을 재생성).

| mode | 첫 검증 시점 |
| --- | --- |
| `onSubmit` (기본) | 제출할 때 |
| `onBlur` | 포커스를 잃을 때 |
| `onChange` | 매 입력마다 (리렌더 최다) |
| `onTouched` | 첫 blur 이후 매 입력마다 |
| `all` | blur + change |

첫 제출 이후에는 `reValidateMode`(기본 `onChange`)에 따라 재검증되어, 고치는 즉시 에러가 사라진다.

## 실측 동작

- 빈 폼 제출 → 모든 필드 에러 + **첫 에러 필드로 자동 포커스**
- `AB` 입력 → `minLength` 와 `pattern` 둘 다 위반이지만 `minLength` 하나만 표시
- `handleSubmit(onValid, onInvalid)` — 두 번째 인자는 검증 실패 시 호출

## 남은 문제 (03 에서 해결)

`validate` 는 **자기 필드가 바뀔 때만** 돈다.
비밀번호를 고쳐도 "비밀번호 확인" 의 에러는 갱신되지 않는다 → `trigger` 또는 `deps` 로 해결.
