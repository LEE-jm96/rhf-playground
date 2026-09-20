# 05. Controller / useController

## 왜 필요한가

`register` 는 `{name, onChange, onBlur, ref}` 를 **DOM 요소에 붙이고 `ref.value` 를 읽는** 방식이다.
따라서 값을 읽을 수 있는 네이티브 폼 요소여야 한다.

### register 가 통하는 것

- `<input>` (모든 type), `<select>`, `<textarea>`
- 받은 props 를 **안쪽 네이티브 요소로 그대로 넘기는 래퍼 컴포넌트**
  (React 19 는 ref 가 일반 prop 이라 그냥 되고, 18 이하는 `forwardRef` 필요)

```tsx
function TextField({label, ...rest}) {
    return <label>{label}<input {...rest} /></label>
}

<TextField label="이름" {...register('name')} />   // OK
```

### register 가 안 되는 것

- `<div>` / `<span>` / `<button>` 기반 커스텀 UI → **ref 는 붙지만 읽을 `value` 속성이 없다** (에러 없이 조용히 값이 안 잡힌다)
- 값을 `value` prop 으로 받고 `onChange(값)` 을 부르는 컴포넌트 (MUI DatePicker 등)
  → 안쪽에 `<input>` 이 있어도 **값을 컴포넌트가 들고 있어서** 안 된다

> **기준은 태그가 아니라 값의 위치다. DOM 이 값을 들고 있으면 `register`, 컴포넌트가 들고 있으면 `Controller`.**

## Controller

```tsx
<Controller
    name="plan"
    control={control}                        // useForm 이 돌려준 control
    rules={{required: '요금제를 선택하세요'}}  // 규칙은 register 대신 여기
    render={({field, fieldState}) => (
        <>
            <PlanPicker value={field.value} onChange={field.onChange}/>
            {fieldState.error && <p className="error">{fieldState.error.message}</p>}
        </>
    )}
/>
```

- `field` = `{value, onChange, onBlur, ref, name}` → 내 컴포넌트에 맞게 연결
- `fieldState` = `{error, isDirty, isTouched}` → `formState.errors` 없이 필드별 에러 처리 가능

### 보이는 값 ≠ 저장되는 값

```tsx
<input
    value={field.value.toLocaleString()}                                   // 화면: 25,000
    onChange={(e) => field.onChange(Number(e.target.value.replace(/[^0-9]/g, '')))}  // 폼: 25000
/>
```

## useController

`Controller` 는 내부적으로 `useController` 를 쓰는 얇은 껍데기다. **기능은 동일하고 연결 코드의 위치만 다르다.**

```tsx
// 컴포넌트 안에서 스스로 연결 → 쓰는 쪽은 한 줄
const {field} = useController({name, control})

<ToggleField name="marketing" control={control} label="마케팅 수신"/>
```

| | 언제 |
| --- | --- |
| `Controller` | 그 폼에서 한 번만 쓰는 UI, 필드마다 연결 방식이 다를 때, 남의 컴포넌트를 그대로 쓸 때 |
| `useController` | 여러 폼에서 재사용할 공용 입력 컴포넌트를 만들 때 |

실무 흐름: 인라인 `Controller` → 같은 패턴이 반복되면 `useController` 로 감싼 공용 컴포넌트로 승격.

## 리렌더

`Controller` 로 연결한 필드는 제어 컴포넌트라서 값이 바뀔 때마다 리렌더된다.
다만 **리렌더 범위가 그 Controller 안쪽으로 한정**되어 폼 전체가 다시 그려지지는 않는다.
→ **register 로 되는 건 register, 안 되는 것만 Controller.**

## 실측

- `<span>` 기반 별점은 접근성 트리에 폼 요소로 잡히지도 않지만, `Controller` 로 연결하니
  `별점을 선택하세요` 검증과 제출 데이터(`rating: 4`)가 정상 동작
- 즉 연결만 되면 검증 · errors · reset · 제출은 `register` 필드와 **완전히 동일**하게 동작한다
