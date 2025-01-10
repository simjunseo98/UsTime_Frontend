import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import api from "../service/api.js";
import styles from "../assets/style/SignUp.module.scss";

// 유효성 검사
const valid = yup.object().shape({
    email: yup.string().email("이메일 형식으로 입력하세요.").required('ID를 입력하세요.'),
    password: yup.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.').required('비밀번호를 입력하세요.'),
    name: yup.string().required('이름을 입력하세요.'),
    birthdate: yup.string().min(10, '생년월일 8자리를 입력하세요.').required('생년월일을 입력하세요.'),
    gender: yup.string().oneOf(["남자", "여자"], " 성별을 선택해주세요.").required("성별을 선택해주세요."),
    phone: yup.string().min(13, '전화번호 11자리를 입력하세요.').required('전화번호를 입력하세요.')
});

const SignUp = () => {
    const [gender, setGender] = useState(''); // 성별 선택 상태 관리
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(valid)
    });

    //성별 값 핸들러
    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
        setValue("gender", selectedGender === "male" ? "남자" : "여자", { shouldValidate: true }); //성별 값 설정
    };

    // 전화번호 포맷 함수
    const formatPhoneNumber = (value) => {
        // 숫자만 남기기
        const onlyNums = value.replace(/[^0-9]/g, "");
        if (onlyNums.length <= 3) return onlyNums;
        if (onlyNums.length <= 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    };

    // 전화번호 입력 핸들러
    const handlePhoneInputChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setValue("phone", formattedPhoneNumber, { shouldValidate: true }); // useForm의 값 설정
    };

    // 생년월일 포맷 함수
    const formatDate = (value) => {
        const onlyNums = value.replace(/[^0-9]/g, ""); // 숫자만 남기기
        if (onlyNums.length <= 4) return onlyNums; // "YYYY"
        if (onlyNums.length <= 6) return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4)}`; // "YYYY.MM"
        return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4, 6)}-${onlyNums.slice(6, 8)}`; // "YYYY.MM.DD"
    };

    // 생년월일 입력 핸들러
    const handleDateInputChange = (e) => {
        const formattedDate = formatDate(e.target.value);
        setValue("birthdate", formattedDate, { shouldValidate: true }); 
    };

    const onSubmit = async (data) => {
        console.log("전송 데이터:", JSON.stringify(data, null, 2));
        try {
            const response = await api.post('/user/signup', data, {
                withCredentials: true
            });
            console.log('회원가입 성공 :', response.data);
            alert('회원가입 되었습니다.')
            navigate('/Login');
        } catch (error) {
            console.error('회원가입 실패 :', error.response?.data || error.message);
            alert('회원가입 실패했습니다.❌')
            console.log(data);
        }
    };
    const goBack = () => {
        navigate(-1);
    };

    return (
        <>
            <div className={styles.header}><h1 className={styles.logo}>Us_Time</h1></div>
            <div className={styles.Container}>
                <h2 className={styles.SignUpTitle}>회원 가입</h2>

                <div className={styles.signupContainer}>
                    <button onClick={goBack} className={styles.goBackButton}></button>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.SignUpGroup}>
                            <div className={`${styles.inputField} ${errors.phone ? styles.errorinput : ''}`}>
                                <label className={styles.label}></label>
                                <input type="email"
                                    placeholder="아이디"
                                    className={styles.input}
                                    {...register('email')}>
                                </input>
                            </div>

                            <div className={`${styles.inputField} ${errors.phone ? styles.errorinput : ''}`}>
                                <label className={styles.label2}></label>
                                <input type="password"
                                    placeholder="비밀번호"
                                    className={styles.input}
                                    {...register('password')}>
                                </input>
                            </div>
                        </div>
                        <p className={styles.errorsP}>{errors.email?.message}</p>
                        <p className={styles.errorsP}>{errors.password?.message}</p>

                        <div className={styles.SignUpGroup}>
                            <div className={`${styles.inputField} ${errors.phone ? styles.errorinput : ''}`}>
                                <label className={styles.label}></label>
                                <input type="text"
                                    placeholder="이름"
                                    className={styles.input}
                                    {...register('name')}></input>
                            </div>

                            <div className={`${styles.inputField} ${errors.phone ? styles.errorinput : ''}`}>
                                <label className={styles.label4}></label>
                                <input type="text"
                                    placeholder="생년월일 8자리"
                                    className={styles.input}
                                    {...register('birthdate')}
                                    onChange={handleDateInputChange}
                                ></input>
                            </div>

                            <div className={`${`${styles.inputField} ${errors.phone ? styles.errorinput : ''}`} ${errors.phone ? styles.errorinput : ''}`}>
                                <label className={styles.label5}></label>
                                <input type="text"
                                    placeholder="전화번호"
                                    className={styles.input}
                                    {...register('phone')}
                                    onChange={handlePhoneInputChange}></input>
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
                                <input type="hidden" {...register("gender")} />
                            </div>
                        </div>
                        <p className={styles.errorsP}>{errors.name?.message}</p>
                        <p className={styles.errorsP}>{errors.birthdate?.message}</p>
                        <p className={styles.errorsP}>{errors.phone?.message}</p>
                        <p className={styles.errorsP}>{errors.gender?.message}</p>
                        <button className={styles.SignUpButton} type="submit" >Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default SignUp;