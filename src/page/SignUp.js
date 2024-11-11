import React,{useState} from "react";
import styles from "../assets/style/SignUp.module.scss";

// 유효성 검사
// const valid = yup.object().shape({
//     userId: yup.string().required('ID를 입력하세요'),
//     userPw: yup.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다').required('비밀번호를 입력하세요'),
//     userName: yup.string().required('이름을 입력하세요'),
//     userAddress: yup.string().required('주소를 입력하세요'),
//     userAge: yup.number().typeError('나이는 숫자여야 합니다').required('나이를 입력하세요').positive('유효한 나이를 입력하세요').integer('나이는 정수여야 합니다'),
//     userPhone: yup.number().typeError('유효한 전화번호를 입력하세요').required('전화번호를 입력하세요')
// });

const SignUp = () => {
    const [gender, setGender] = useState(''); // 성별 선택 상태 관리

    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
    };


    // const navigate = useNavigate();
    // const { register, handleSubmit, formState: { errors } } = useForm({
    //     resolver: yupResolver(valid)
    // });

    // const onSubmit = async (data) => {
    //     try {
    //         const response = await api.post('/user/signup', data, {
    //             withCredentials: true
    //         });
    //         console.log('회원가입 성공 :', response.data);
    //         alert('회원가입 성공😊')
    //         navigate('/login');
    //     } catch (error) {
    //         console.error('회원가입 실패 :', error);
    //         alert('회원가입 실패했습니다.❌')
    //         console.log(data);
    //     }
    // };
    return(
        <div className={styles.Container}>
            <h2 className={styles.SignUpTitle}>UsTime</h2>
        <div className={styles.signupContainer}>
            <form>
            {/* <form onSubmit={handleSubmit(onSubmit)}> */}
            <div className={styles.SignUpGroup}>
                  <div className={styles.inputField}>
                   <label className={styles.label}></label>
                    <input type="text" placeholder="아이디" className={styles.input}></input>
                    {/* <input type="text" {...register('userId')} /> */}
                    {/* <p>{errors.userId?.message}</p> */}
                    </div>

                    <div className={styles.inputField}>
                        <label className={styles.label2}></label>
                    <input type="password" placeholder="비밀번호" className={styles.input}></input>
                    {/* <input type="password" {...register('userPw')} /> */}
                    {/* <p>{errors.userPw?.message}</p> */}
                        </div>

                     </div>

<div className={styles.SignUpGroup}>
                     <div className={styles.inputField}>
                     <label className={styles.label}></label>
                    <input type="text" placeholder="이름" className={styles.input}></input>
                    {/* <input type="text" {...register('userName')} /> */}
                    {/* <p>{errors.userName?.message}</p> */}
      </div>

<div className={styles.inputField}>
    <label className={styles.label4}></label>
                    <input type="text" placeholder="생년월일 8자리" className={styles.input}></input>
                    {/* <input type="text" {...register('userAge')} /> */}
                    {/* <p>{errors.userAge?.message}</p> */}
</div>

<div className={styles.inputField}>
<label className={styles.label5}></label>
                    <input type="text" placeholder="전화번호" className={styles.input}></input>
                    {/* <input type="text" {...register('userPhone')} /> */}
                    {/* <p>{errors.userPhone?.message}</p> */}          
            </div>
      <div className={styles.genderButtonContainer}>
                        <button
                            type="button"
                            onClick={() => handleGenderSelect('male')}
                            className={`${styles.genderButton} ${gender === 'male' ? styles.selected : ''}`}
                        >
                            남자
                        </button>
                        <button
                            type="button"
                            onClick={() => handleGenderSelect('female')}
                            className={`${styles.genderButton} ${gender === 'female' ? styles.selected : ''}`}
                        >
                            여자
                        </button>
                    </div>
            </div>
                <button className={styles.SignUpButton} type="submit">Sign Up</button>
            </form>
        </div>
        </div>
    );
}
export default SignUp;