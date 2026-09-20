import {Controller, useController, useForm, type Control} from 'react-hook-form'

type FormValues = {
    plan: string
    price: number
    marketing: boolean
    rating: number
}

export default function Step05Controller() {
    // 에러는 formState.errors 대신 각 Controller 의 fieldState 에서 꺼내 쓴다
    const {control, handleSubmit} = useForm<FormValues>({
        defaultValues: {plan: '', price: 0, marketing: false, rating: 0},
    })

    const onSubmit = (data: FormValues) => alert(JSON.stringify(data, null, 2))

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* ① Controller: control 을 넘기고 render 안에서 field 를 연결한다 */}
            <p>요금제 (Controller)</p>
            <Controller
                name="plan"
                control={control}
                rules={{required: '요금제를 선택하세요'}}
                render={({field, fieldState}) => (
                    <>
                        <PlanPicker value={field.value} onChange={field.onChange}/>
                        {fieldState.error && <p className="error">{fieldState.error.message}</p>}
                    </>
                )}
            />

            {/* ② Controller + 값 가공: 화면엔 "1,000" 으로 보이고 폼에는 숫자로 저장 */}
            <p>금액 (Controller + 값 변환)</p>
            <Controller
                name="price"
                control={control}
                rules={{min: {value: 1000, message: '1,000원 이상 입력하세요'}}}
                render={({field, fieldState}) => (
                    <>
                        <input
                            value={field.value.toLocaleString()}
                            onChange={(e) => field.onChange(Number(e.target.value.replace(/[^0-9]/g, '')))}
                            onBlur={field.onBlur}
                            ref={field.ref}
                        />
                        {fieldState.error && <p className="error">{fieldState.error.message}</p>}
                    </>
                )}
            />

            {/* ③ useController: 재사용 가능한 입력 컴포넌트로 감싸는 방식 */}
            <p>마케팅 수신 (useController)</p>
            <ToggleField name="marketing" control={control} label="마케팅 정보 수신 동의"/>

            {/* ④ div/span 만으로 만든 컴포넌트 — 폼 요소가 하나도 없어 register 가 아예 불가능 */}
            <p>별점 (div 기반)</p>
            <Controller
                name="rating"
                control={control}
                rules={{min: {value: 1, message: '별점을 선택하세요'}}}
                render={({field, fieldState}) => (
                    <>
                        <StarRating value={field.value} onChange={field.onChange}/>
                        {fieldState.error && <p className="error">{fieldState.error.message}</p>}
                    </>
                )}
            />

            <button type="submit">제출</button>
        </form>
    )
}

// input/select/button 없이 div 와 span 만 사용한다 → 읽을 value 속성이 없다
function StarRating({value, onChange}: { value: number; onChange: (v: number) => void }) {
    return (
        <div style={{display: 'flex', gap: 4, fontSize: 24, cursor: 'pointer'}}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => onChange(star)}
                    style={{color: star <= value ? '#f5a623' : '#ddd'}}
                >
                    ★
                </span>
            ))}
        </div>
    )
}

// register 를 붙일 수 없는 컴포넌트: DOM input 이 아니라 div/button 으로 만들어졌다
function PlanPicker({value, onChange}: { value: string; onChange: (v: string) => void }) {
    const plans = [
        {id: 'basic', label: '베이직'},
        {id: 'pro', label: '프로'},
        {id: 'team', label: '팀'},
    ]

    return (
        <div style={{display: 'flex', gap: 8}}>
            {plans.map((p) => (
                <button
                    key={p.id}
                    type="button"
                    onClick={() => onChange(p.id)}
                    style={{
                        padding: '6px 12px',
                        border: value === p.id ? '2px solid #105aff' : '1px solid #ccc',
                        background: value === p.id ? '#eef3ff' : '#fff',
                    }}
                >
                    {p.label}
                </button>
            ))}
        </div>
    )
}

// useController 로 폼 연결을 컴포넌트 안에 숨긴다 → 사용하는 쪽은 name 과 control 만 넘긴다
function ToggleField({
                         name,
                         control,
                         label,
                     }: {
    name: 'marketing'
    control: Control<FormValues>
    label: string
}) {
    const {field} = useController({name, control})

    return (
        <button
            type="button"
            onClick={() => field.onChange(!field.value)}
            onBlur={field.onBlur}
            ref={field.ref}
            style={{
                padding: '6px 12px',
                border: '1px solid #ccc',
                background: field.value ? '#105aff' : '#fff',
                color: field.value ? '#fff' : '#1a1a1a',
            }}
        >
            {label}: {field.value ? 'ON' : 'OFF'}
        </button>
    )
}
