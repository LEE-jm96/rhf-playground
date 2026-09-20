import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

// 검증 규칙을 스키마 한 곳에 모은다 (register 에는 규칙을 쓰지 않는다)
const schema = z
    .object({
        userId: z
            .string()
            .min(4, '4자 이상 입력하세요')
            .max(12, '12자 이하로 입력하세요')
            .regex(/^[a-z0-9]+$/, '영문 소문자와 숫자만 가능합니다'),
        email: z.email('이메일 형식이 아닙니다'),
        age: z
            .number('나이를 입력하세요')
            .int('정수만 입력하세요')
            .min(14, '14세 이상만 가입 가능합니다')
            .max(100, '100 이하로 입력하세요'),
        password: z
            .string()
            .min(8, '8자 이상이어야 합니다')
            .regex(/[a-zA-Z]/, '영문을 포함해야 합니다')
            .regex(/\d/, '숫자를 포함해야 합니다'),
        passwordConfirm: z.string(),
        // z.literal(true) 로 쓰면 타입이 true 로 고정돼 기본값 false 를 넣을 수 없다
        agree: z.boolean().refine((v) => v, '약관에 동의해야 합니다'),
    })
    // 필드 간 검증은 object 전체에 refine 을 건다
    .refine((v) => v.password === v.passwordConfirm, {
        message: '비밀번호가 일치하지 않습니다',
        path: ['passwordConfirm'], // 이 필드의 에러로 등록
    })

// 타입을 따로 선언하지 않고 스키마에서 뽑아 쓴다
type FormValues = z.infer<typeof schema>

export default function Step04Schema() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onTouched',
        defaultValues: {
            userId: '',
            email: '',
            age: undefined,
            password: '',
            passwordConfirm: '',
            agree: false,
        },
    })

    const onSubmit = (data: FormValues) => alert('통과!\n' + JSON.stringify(data, null, 2))

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <label>
                아이디
                <input {...register('userId')} />
            </label>
            {errors.userId && <p className="error">{errors.userId.message}</p>}

            <label>
                이메일
                <input {...register('email')} />
            </label>
            {errors.email && <p className="error">{errors.email.message}</p>}

            {/* 스키마가 number 를 기대하므로 valueAsNumber 로 변환해 넘긴다 */}
            <label>
                나이
                <input type="number" {...register('age', {valueAsNumber: true})} />
            </label>
            {errors.age && <p className="error">{errors.age.message}</p>}

            <label>
                비밀번호
                <input type="password" {...register('password')} />
            </label>
            {errors.password && <p className="error">{errors.password.message}</p>}

            <label>
                비밀번호 확인
                <input type="password" {...register('passwordConfirm', {deps: ['password']})} />
            </label>
            {errors.passwordConfirm && <p className="error">{errors.passwordConfirm.message}</p>}

            <label>
                <input type="checkbox" {...register('agree')} /> 약관 동의
            </label>
            {errors.agree && <p className="error">{errors.agree.message}</p>}

            <button type="submit">가입</button>
        </form>
    )
}
