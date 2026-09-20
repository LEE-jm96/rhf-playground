import type { ComponentType } from 'react'
import Step00Setup from './Step00Setup'
import Step01Basic from './Step01Basic'
import Step02Validation from './Step02Validation'
import Step03Values from './Step03Values'
import Step04Schema from './Step04Schema'
import Step05Controller from './Step05Controller'

export type Step = {
  id: string
  title: string
  component: ComponentType
}

// 새 단계를 만들면 여기에 한 줄 추가
export const steps: Step[] = [
  { id: '00', title: '초기 셋팅 확인', component: Step00Setup },
  { id: '01', title: '기본: register / handleSubmit', component: Step01Basic },
  { id: '02', title: '검증과 에러 / mode', component: Step02Validation },
  { id: '03', title: '값 다루기: watch / setValue / reset', component: Step03Values },
  { id: '04', title: '스키마 검증: zod + resolver', component: Step04Schema },
  { id: '05', title: 'Controller / useController', component: Step05Controller },
]
