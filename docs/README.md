# 단계별 정리

각 단계에서 알아야 할 점과 실습하며 확인한 실측 결과 모음.

| 문서 | 한 줄 요약 |
| --- | --- |
| [00. 초기 셋팅](00-setup.md) | `useForm` / `register` / `handleSubmit` 과 값이 흐르는 경로 |
| [01. 기본](01-basic.md) | input 타입별 data 모양, number·체크박스 그룹의 함정 |
| [02. 검증과 에러](02-validation.md) | 규칙은 `register`, 결과는 `errors`, 타이밍은 `mode` |
| [03. 값 다루기](03-values.md) | `watch`/`getValues` 구독 차이, `setValue`/`reset`/`trigger` |
| [04. 스키마 검증](04-schema.md) | zod 로 타입·검증을 한 곳에 모으기 |
| [05. Controller](05-controller.md) | DOM 이 값을 못 들고 있는 컴포넌트를 폼에 편입시키기 |

## 전체를 관통하는 것

- **RHF 는 값을 React state 가 아니라 내부 JS 객체에 들고 있다.** 그래서 입력해도 리렌더가 없고,
  화면에 값을 쓰려고 구독(`watch`)한 만큼만 리렌더가 생긴다.
- **개발자는 선언만 한다.** 규칙(`rules`/스키마)을 선언하면 검증·`errors` 채우기·포커스 이동·
  dirty/touched 추적·제출 흐름은 RHF 가 처리한다.
- 설계상 이점은 리렌더 최소화, 개발상 이점은 필드/폼 상태 관리 코드가 사라지는 것.
