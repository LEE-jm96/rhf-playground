import {useForm} from 'react-hook-form'

type FormValues = { message: string }

// 라이브러리가 정상 설치됐는지만 확인하는 최소 폼
export default function Step00Setup() {
    const {register, handleSubmit} = useForm<FormValues>({
        defaultValues: {message: '셋팅 완료!'},
    })

    const onSubmit = (data: FormValues) => alert(JSON.stringify(data))

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <p>제출 버튼을 눌러 alert 가 뜨면 react-hook-form 이 정상 동작하는 것입니다.</p>
            <input {...register('message')} />
            <button type="submit">제출</button>
        </form>
    )
}
