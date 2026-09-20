# 04. 스키마 검증 — zod + zodResolver

02 와 **같은 회원가입 폼**을, 규칙만 스키마로 옮긴 단계. 비교해서 보면 차이가 분명하다.

## 무엇이 달라지나

```tsx
// 02: 규칙이 register 마다 흩어짐
<input {...register('userId', {required: ..., minLength: ..., pattern: ...})} />

// 04: 규칙은 스키마 한 곳, register 는 연결만
<input {...register('userId')} />
```

```tsx
const schema = z.object({...})
type FormValues = z.infer<typeof schema>            // 타입을 스키마에서 도출

useForm<FormValues>({resolver: zodResolver(schema)})
```

**에러를 꺼내 쓰는 코드(`errors.userId.message`)는 02 와 완전히 동일하다.** 검증 엔진만 교체된다.

## 얻는 것

1. **단일 원본** — 타입·검증이 한 곳. 필드를 추가하면 타입이 따라온다.
2. **재사용** — 스키마는 그냥 객체라서 폼 밖으로 나온다. `schema.pick({email: true})`, 서버 검증 공유, `schema.safeParse(값)` 로 화면 없이 단위 테스트.
3. **값 변환** — `trim`, `transform`, `z.coerce` 로 정리까지 맡길 수 있다.

## 언제 쓰나

| 상황 | 추천 |
| --- | --- |
| 필드 적고 규칙 단순 (검색 폼 등) | `register` 규칙 (02) |
| 필드 많음 / 필드 간 검증 / 타입 공유 | zod 스키마 (04) |

## 문법 포인트

```tsx
// 필드 간 검증은 object 전체에 refine, path 로 에러 붙일 필드 지정
.refine((v) => v.password === v.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
})
```

```tsx
// 스키마가 number 를 기대하므로 변환해서 넘겨야 한다 (01 의 함정이 여기서 터진다)
<input type="number" {...register('age', {valueAsNumber: true})} />

// 03 의 trigger 를 옵션 한 줄로 대체
<input {...register('passwordConfirm', {deps: ['password']})} />
```

## zod v4 주의점 (v3 문서와 다름)

| 하려는 것 | v4 |
| --- | --- |
| 이메일 | `z.email('메시지')` — `z.string().email()` 은 구식 |
| 필수 체크박스 | `z.boolean().refine((v) => v, '메시지')` |

`z.literal(true)` 를 쓰면 타입이 `true` 로 고정되어 `defaultValues: {agree: false}` 에서 **TS 에러**가 난다.

## 실측

- 빈 폼 제출 → `4자 이상 입력하세요`, `이메일 형식이 아닙니다`, `나이를 입력하세요`, `8자 이상이어야 합니다`, `약관에 동의해야 합니다`
- 비밀번호 불일치 → `refine` 메시지가 확인 칸에 표시
- 정상 입력 → `age` 가 숫자 31 로 통과
