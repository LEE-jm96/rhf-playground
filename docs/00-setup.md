# 00. 초기 셋팅

## 스택

| 패키지 | 버전 | 비고 |
| --- | --- | --- |
| react | 19 | |
| vite | 8 | **Node 20.19+ 필요** (`.nvmrc` = 24) |
| typescript | 6 | |
| react-hook-form | 7.88 | |
| zod | 4 | v3 와 API 가 다르다 (04 참고) |
| @hookform/resolvers | 5 | |

```bash
nvm use        # Node 24
npm install
npm run dev
```

## 구조

- 단계별 파일: `src/steps/StepNN*.tsx`
- 단계 등록: `src/steps/index.ts` 에 한 줄 추가
- 좌측 메뉴에서 단계 선택 (`src/App.tsx`)

## Step00Setup 에서 쓴 API

```tsx
const {register, handleSubmit} = useForm<FormValues>({
    defaultValues: {message: '셋팅 완료!'},
})

<form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('message')} />
</form>
```

### useForm

폼 하나를 만드는 진입점. **인자는 폼 값이 아니라 옵션 객체**다.

```tsx
useForm<FormValues>({
    defaultValues: {...},   // 초기값
    mode: 'onBlur',         // 검증 시점 (02)
    resolver: zodResolver(),// 스키마 검증 (04)
})
```

- 값을 최상위에 바로 쓰면(`useForm({message: '...'})`) 안 된다. 옵션 이름과 필드 이름이 충돌할 수 있어 `defaultValues` 안에 담는다.
- 제네릭 `<FormValues>` 가 **설계도**다. `register` 의 이름, `defaultValues` 의 키 모두 이 타입에 맞춰야 하고, 어긋나면 TS 가 잡아준다.

### register

input 을 폼에 등록한다. 호출하면 `{name, onChange, onBlur, ref}` 를 돌려주고, 이를 spread 로 붙인다.

- `ref` 로 **DOM 을 직접 잡는다** → 값은 React state 가 아니라 DOM 에 있다 (비제어 방식)
- 그래서 **타이핑해도 리렌더되지 않는다**

### handleSubmit

제출 이벤트를 감싸는 고차 함수.

1. `preventDefault()` 자동 호출
2. 값 수집
3. 검증
4. 통과 → `onValid(data)` / 실패 → `onInvalid(errors)` (있으면)

## 데이터 흐름 (중요)

```
defaultValues ─▶ 내부 JS 객체(_formValues) 초기화 + input 초기 표시

사용자 타이핑 ─▶ DOM 값 변경
              └▶ register 가 붙인 onChange 가 DOM 값을 읽어 내부 객체에 저장
                 (setState 아님 → 리렌더 없음)

submit ─▶ handleSubmit ─▶ 내부 객체 복사 → 검증 → onSubmit(data)
```

- `data` 는 **제출 시점에 DOM 에서 긁어온 값이 아니라**, 평소에 동기화해 둔 내부 JS 객체다.
- 내부 객체에 값이 들어가는 경로는 3가지: `defaultValues`, `register` 의 onChange, `setValue`/`reset`.
- 따라서 **이벤트 없이 DOM 을 직접 바꾸면 RHF 는 모른다.**

```js
document.querySelector('input').value = '안녕'  // ❌ 제출 데이터에 반영 안 됨
setValue('message', '안녕')                      // ✅
```

## 리렌더 확인법

컴포넌트 안에 `console.log('render')` 를 넣고 타이핑해 본다.

- 최초 2번 찍히는 것은 정상 — `<StrictMode>` 가 개발 모드에서 두 번 실행한다.
- 타이핑해도 늘지 않으면 리렌더가 없는 것.
- `watch('x')` 를 추가하면 글자마다 늘어난다 → **구독한 만큼만 리렌더**된다 (03, 09).
