# 01. 기본 — input 타입별 register

`register` 를 여러 input 타입에 붙였을 때 제출 `data` 가 어떤 모양이 되는지 확인하는 단계.

## 타입별 결과

| input | data 에 담기는 값 | 주의 |
| --- | --- | --- |
| text / textarea | 문자열 | |
| `type="number"` | **기본은 문자열** `"31"` | `{valueAsNumber: true}` 필요 |
| select | 선택된 option 의 value | |
| radio (같은 이름 여러 개) | 선택된 value 하나 | 같은 name 으로 여러 번 register |
| checkbox 1개 (value 없음) | `true` / `false` | |
| checkbox 여러 개 (같은 name + value) | 체크된 value 배열 | `defaultValues` 에 `[]` 필수 |

## 함정 1 — number 는 문자열로 들어온다

```tsx
<input type="number" {...register('age')} />                        // "31"
<input type="number" {...register('age', {valueAsNumber: true})} /> // 31
```

TS 타입은 `number` 인데 실제 값은 문자열이 된다. 타입이 거짓말을 하므로 에디터는 경고하지 않는다.
04 단계에서 zod 스키마가 `number` 를 기대할 때 실제로 터진다.

## 함정 2 — 체크박스 그룹의 defaultValues (실측)

`hobbies: []` 를 빼고 실험한 결과:

| 조작 | data.hobbies |
| --- | --- |
| 아무것도 안 건드리고 제출 | **`false`** |
| 체크했다가 해제하고 제출 | `[]` |
| 하나 체크하고 제출 | `["game"]` |

기본값 `[]` 가 있으면 어떤 경우에도 배열이 보장된다.

### 왜 위험한가

`false` 는 화면상 "비어 있음"과 같아 보이지만 데이터는 다르다.

| | `[]` | `false` |
| --- | --- | --- |
| `.length` | `0` | `undefined` |
| `.map()` / `.includes()` | 정상 | **TypeError** |
| 서버 전송 JSON | `[]` | `false` → 리스트 기대하는 API 가 500 |

TS 타입은 `string[]` 이라 에디터도 안 잡아준다. **체크박스 그룹은 `defaultValues` 에 `[]` 를 반드시 넣는다.**

## 참고 — JSON 키 순서로 상태를 읽을 수 있다

`defaultValues` 에 있던 필드는 선언 순서대로 나오고, 나중에 이벤트로 생긴 필드는 **맨 뒤**에 붙는다.
`hobbies` 가 맨 뒤에 있으면 기본값 없이 나중에 추가된 것이다.

## HMR 주의

코드를 고쳐도 페이지를 새로고침하지 않으면, Fast Refresh 가 **기존 useForm 내부 상태를 유지**한다.
`defaultValues` 를 바꿨는데 결과가 그대로면 새로고침(⌘R)부터 한다.
