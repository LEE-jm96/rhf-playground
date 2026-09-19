# rhf-playground

react-hook-form 개인 학습 레포 — 초기 셋팅부터 심화까지 단계별 실습.

## 실행

```bash
nvm use        # .nvmrc = Node 24 (Vite 8 은 Node 20.19+ 필요)
npm install
npm run dev
```

좌측 메뉴에서 단계를 골라 확인한다. 각 단계는 `src/steps/StepNN*.tsx` 하나이고,
`src/steps/index.ts` 에 등록한다.

## 스택

| 패키지 | 버전 |
| --- | --- |
| react | 19 |
| vite | 8 |
| typescript | 6 |
| react-hook-form | 7.88 |
| zod | 4 |
| @hookform/resolvers | 5 |

## 커리큘럼

- [x] 00. 초기 셋팅
- [x] 01. 기본 — `useForm` / `register` / `handleSubmit`
- [x] 02. 검증과 에러 — 내장 규칙, `formState.errors`, `mode`
- [ ] 03. 값 다루기 — `defaultValues` / `watch` / `setValue` / `reset`
- [ ] 04. 스키마 검증 — zod + `zodResolver`
- [ ] 05. `Controller` / `useController` — 외부 UI 컴포넌트 연결
- [ ] 06. `useFieldArray` — 동적 행
- [ ] 07. `FormProvider` / `useFormContext` — 큰 폼 쪼개기
- [ ] 08. 비동기 — async `defaultValues`, `setError`, `isSubmitting`
- [ ] 09. 성능 — `formState` Proxy, `useWatch`, `useFormState`
- [ ] 10. 테스트 — Vitest + Testing Library
- [ ] 마무리. 다단계 회원가입 위저드
