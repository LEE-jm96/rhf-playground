import {useState} from 'react'
import {useForm, type FieldErrors, type Mode} from 'react-hook-form'

type FormValues = {
    userId: string
    email: string
    age: number
    password: string
    passwordConfirm: string
    agree: boolean
}

const MODES: Mode[] = ['onSubmit', 'onBlur', 'onChange', 'onTouched', 'all']

// mode 는 useForm 생성 시점에만 읽히므로, 바꿀 때는 key 로 폼을 새로 만든다
export default function Step02Validation() {
    const [mode, setMode] = useState<Mode>('onSubmit')

    return (
        <>
            <div>
                mode:{' '}
                {MODES.map((m) => (
                    <label key={m} style={{marginRight: 12}}>
                        <input type="radio" checked={mode === m} onChange={() => setMode(m)}/> {m}
                    </label>
                ))}
            </div>
            <hr/>
            <SignupForm key={mode} mode={mode}/>
        </>
    )
}

function SignupForm({mode}: { mode: Mode }) {
    const {
        register,
        handleSubmit,
        getValues,
        formState: {errors, submitCount},
    } = useForm<FormValues>({
        mode,
        defaultValues: {
            userId: '',
            email: '',
            age: undefined,
            password: '',
            passwordConfirm: '',
            agree: false,
        },
    })

    // 검증 통과 시에만 호출
    const onValid = (data: FormValues) => alert('통과!\n' + JSON.stringify(data, null, 2))

    // 검증 실패 시 호출 (선택)
    const onInvalid = (errs: FieldErrors<FormValues>) => console.log('검증 실패', errs)

    return (
        <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate>
            {/* required / minLength / maxLength / pattern */}
            <label>
                아이디
                <input
                    {...register('userId', {
                        required: '아이디는 필수입니다',
                        minLength: {value: 4, message: '4자 이상 입력하세요'},
                        maxLength: {value: 12, message: '12자 이하로 입력하세요'},
                        pattern: {value: /^[a-z0-9]+$/, message: '영문 소문자와 숫자만 가능합니다'},
                    })}
                />
            </label>
            {errors.userId && <p className="error">{errors.userId.message}</p>}

            <label>
                이메일
                <input
                    type="email"
                    {...register('email', {
                        required: '이메일은 필수입니다',
                        pattern: {value: /^\S+@\S+\.\S+$/, message: '이메일 형식이 아닙니다'},
                    })}
                />
            </label>
            {errors.email && <p className="error">{errors.email.message}</p>}

            {/* min / max (숫자) */}
            <label>
                나이
                <input
                    type="number"
                    {...register('age', {
                        valueAsNumber: true,
                        required: '나이는 필수입니다',
                        min: {value: 14, message: '14세 이상만 가입 가능합니다'},
                        max: {value: 100, message: '100 이하로 입력하세요'},
                    })}
                />
            </label>
            {errors.age && <p className="error">{errors.age.message}</p>}

            {/* validate: 여러 개의 커스텀 규칙 (true 면 통과, 문자열이면 에러 메시지) */}
            <label>
                비밀번호
                <input
                    type="password"
                    {...register('password', {
                        required: '비밀번호는 필수입니다',
                        validate: {
                            hasLetter: (v) => /[a-zA-Z]/.test(v) || '영문을 포함해야 합니다',
                            hasNumber: (v) => /\d/.test(v) || '숫자를 포함해야 합니다',
                            longEnough: (v) => v.length >= 8 || '8자 이상이어야 합니다',
                        },
                    })}
                />
            </label>
            {errors.password && (
                <p className="error">
                    [{errors.password.type}] {errors.password.message}
                </p>
            )}

            {/* validate: 다른 필드 값과 비교 */}
            <label>
                비밀번호 확인
                <input
                    type="password"
                    {...register('passwordConfirm', {
                        required: '비밀번호 확인은 필수입니다',
                        validate: (v) => v === getValues('password') || '비밀번호가 일치하지 않습니다',
                    })}
                />
            </label>
            {errors.passwordConfirm && <p className="error">{errors.passwordConfirm.message}</p>}

            {/* checkbox required: 체크 안 하면 에러 */}
            <label>
                <input type="checkbox" {...register('agree', {required: '약관에 동의해야 합니다'})}/> 약관 동의
            </label>
            {errors.agree && <p className="error">{errors.agree.message}</p>}

            <button type="submit">가입</button>

            <p>submitCount: {submitCount}</p>
            <h3>formState.errors</h3>
            <pre>{JSON.stringify(summarize(errors), null, 2)}</pre>
        </form>
    )
}

// errors 에는 DOM ref 가 들어 있어 그대로 stringify 하면 순환참조 에러 → type/message 만 추림
function summarize(errors: FieldErrors<FormValues>) {
    return Object.fromEntries(
        Object.entries(errors).map(([name, err]) => [name, {type: err?.type, message: err?.message}]),
    )
}
