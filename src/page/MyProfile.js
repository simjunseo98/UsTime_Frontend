import React, { useEffect, useState } from 'react';
import Loading from '../Component/Loading';
import styles from '../assets/style/MyProfile.module.scss';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/img/G.jpg';

const MyProfile = () => {
    const [myProfile, setMyProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserInfo = async () => {
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                alert('로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.');
                navigate('/');
                return;
            }

            try {
                // userId를 API 요청에 사용
                const response = await api.get(`/user/userinfo?userId=${userId}`);
                setMyProfile(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        getUserInfo();
    }, [navigate]);

    if (loading) {
        return <div><Loading /></div>;
    }

    if (error) {
        return <p>에러메세지 : {error.message}</p>;
    }

    return (
        <>
   <div className={styles.MyProfileContainer}>
    <div className={styles.profileWrapper}>
        <div className={styles.profileHeader}>
            <h1>내 프로필</h1>
            <button className={styles.editButton} onClick={() => navigate("/myprofileupdate")}>
                정보 수정
            </button>
        </div>
        <div className={styles.profileContent}>
            <div className={styles.profileImageSection}>
                <img src={profileImage} alt="프로필 사진" className={styles.profileImage} />
                <button className={styles.editButton}>사진 바꾸기</button>
                <p><strong>이름:</strong> {myProfile.name}</p>
                <p><strong>전화번호:</strong> {myProfile.phone}</p>
            </div>
            
            <div className={styles.profileDetails}>
                <p><strong>이메일:</strong> {myProfile.email}</p>
                <p><strong>생년월일:</strong> {myProfile.birthdate}</p>
                <p><strong>성별:</strong> {myProfile.gender}</p>
                <p><strong>커플 ID:</strong> {myProfile.coupleId || "미지정"} <button className={styles.editButton} onClick={() => navigate("/matching")}>연동
                </button></p>
                <p><strong>생성일:</strong>  {new Date(myProfile.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })}
                </p>
            </div>
        </div>
    </div>
</div>

        </>
    );
};

export default MyProfile;