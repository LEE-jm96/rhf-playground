import {useState} from 'react'
import {useForm} from 'react-hook-form'

type FormValues = {
    name: string
    age: number
    job: string
    gender: 'male' | 'female'
    agree: boolean
    hobbies: string[]
    intro: string
}

// input 타입별로 register 가 data 에 어떤 값을 담는지 확인
export default function Step01Basic() {
    const [result, setResult] = useState<FormValues | null>(null)

    const {register, handleSubmit} = useForm<FormValues>({
        defaultValues: {
            name: '',
            age: 20,
            job: 'dev',
            gender: 'male',
            agree: false,
            hobbies: [],
            intro: '',
        },
    })

    const onSubmit = (data: FormValues) => setResult(data)

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* text: 문자열 */}
                <label>
                    이름 <input {...register('name')} />
                </label>

                {/* number: valueAsNumber 없으면 "20" 처럼 문자열로 담긴다 */}
                <label>
                    나이 <input type="number" {...register('age', {valueAsNumber: true})} />
                </label>

                {/* select: 선택된 option 의 value */}
                <label>
                    직업
                    <select {...register('job')}>
                        <option value="dev">개발자</option>
                        <option value="design">디자이너</option>
                        <option value="plan">기획자</option>
                    </select>
                </label>

                {/* radio: 같은 이름으로 여러 번 register → 선택된 value 하나 */}
                <div>
                    성별
                    <label>
                        <input type="radio" value="male" {...register('gender')} /> 남
                    </label>
                    <label>
                        <input type="radio" value="female" {...register('gender')} /> 여
                    </label>
                </div>

                {/* checkbox 1개(value 없음): boolean */}
                <label>
                    <input type="checkbox" {...register('agree')} /> 약관 동의
                </label>

                {/* checkbox 여러 개(같은 이름 + value): 체크된 value 배열 */}
                <div>
                    취미
                    <label>
                        <input type="checkbox" value="game" {...register('hobbies')} /> 게임
                    </label>
                    <label>
                        <input type="checkbox" value="book" {...register('hobbies')} /> 독서
                    </label>
                    <label>
                        <input type="checkbox" value="sport" {...register('hobbies')} /> 운동
                    </label>
                </div>

                {/* textarea: 문자열 */}
                <label>
                    자기소개
                    <textarea {...register('intro')} />
                </label>

                <button type="submit">제출</button>
            </form>

            {result && (
                <>
                    <h3>onSubmit 으로 받은 data</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                    <p>age 의 타입: {typeof result.age}</p>
                    <p>
                        hobbies 의 타입: {typeof result.hobbies} / 배열인가: {String(Array.isArray(result.hobbies))}
                    </p>
                </>
            )}
        </>
    )
}
