import {useRef} from 'react'
import {useForm} from 'react-hook-form'

type FormValues = {
    nickname: string
    password: string
    passwordConfirm: string
    zipcode: string
    address: string
}

const DEFAULTS: FormValues = {
    nickname: '',
    password: '',
    passwordConfirm: '',
    zipcode: '',
    address: '',
}

// 서버에서 기존 회원정보를 불러왔다고 가정한 값
const LOADED: FormValues = {
    nickname: '길동',
    password: '',
    passwordConfirm: '',
    zipcode: '26493',
    address: '강원도 원주시 서곤로 20',
}

export default function Step03Values() {
    const renderCount = useRef(0)
    renderCount.current += 1

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        setValue,
        reset,
        trigger,
        formState: {errors, isDirty, dirtyFields},
    } = useForm<FormValues>({defaultValues: DEFAULTS})

    // watch: 값을 구독한다 → 이 값이 바뀌면 컴포넌트가 리렌더된다
    const nickname = watch('nickname')

    const onSubmit = (data: FormValues) => alert(JSON.stringify(data, null, 2))

    // 우편번호 검색 결과를 받아왔다고 가정하고 코드로 값을 주입
    const fillAddress = () => {
        setValue('zipcode', '06236', {shouldDirty: true})
        setValue('address', '서울특별시 강남구 테헤란로 152', {shouldDirty: true, shouldValidate: true})
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <p>렌더 횟수: {renderCount.current}</p>

            {/* watch 로 구독 중이라 타이핑할 때마다 리렌더된다 */}
            <label>
                닉네임
                <input {...register('nickname', {required: '닉네임은 필수입니다'})} />
            </label>
            {errors.nickname && <p className="error">{errors.nickname.message}</p>}
            <p>미리보기(watch): {nickname || '(비어 있음)'}</p>

            {/* getValues 는 구독하지 않는다 → 눌러도 리렌더 없음, 그 시점의 값만 읽는다 */}
            <button type="button" onClick={() => alert(getValues('nickname'))}>
                getValues 로 닉네임 읽기 (리렌더 없음)
            </button>

            {/* 2단계 숙제: 비밀번호를 고치면 확인 칸을 trigger 로 재검증 */}
            <label>
                비밀번호
                <input
                    type="password"
                    {...register('password', {
                        required: '비밀번호는 필수입니다',
                        onChange: () => {
                            if (getValues('passwordConfirm')) trigger('passwordConfirm')
                        },
                    })}
                />
            </label>
            {errors.password && <p className="error">{errors.password.message}</p>}

            <label>
                비밀번호 확인
                <input
                    type="password"
                    {...register('passwordConfirm', {
                        validate: (v) => v === getValues('password') || '비밀번호가 일치하지 않습니다',
                    })}
                />
            </label>
            {errors.passwordConfirm && <p className="error">{errors.passwordConfirm.message}</p>}

            {/* setValue: 코드로 값 주입 (DOM 을 직접 바꾸면 RHF 가 모른다) */}
            <label>
                우편번호
                <input {...register('zipcode')} readOnly/>
            </label>
            <label>
                주소
                <input {...register('address', {required: '주소는 필수입니다'})} />
            </label>
            {errors.address && <p className="error">{errors.address.message}</p>}
            <button type="button" onClick={fillAddress}>
                주소 찾기 (setValue)
            </button>

            {/* reset: 인자 없으면 defaultValues 로, 값을 주면 그 값이 새 기준이 된다 */}
            <div>
                <button type="button" onClick={() => reset()}>
                    reset() — 초기값으로
                </button>
                <button type="button" onClick={() => reset(LOADED)}>
                    reset(불러온 값) — 수정 화면 진입
                </button>
            </div>

            <button type="submit">저장</button>

            <h3>변경 추적</h3>
            <p>isDirty: {String(isDirty)}</p>
            <pre>dirtyFields: {JSON.stringify(dirtyFields, null, 2)}</pre>
        </form>
    )
}
