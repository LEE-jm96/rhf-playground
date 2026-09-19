import type { ComponentType } from 'react'
import Step00Setup from './Step00Setup'

export type Step = {
  id: string
  title: string
  component: ComponentType
}

// 새 단계를 만들면 여기에 한 줄 추가
export const steps: Step[] = [
  { id: '00', title: '초기 셋팅 확인', component: Step00Setup },
]
