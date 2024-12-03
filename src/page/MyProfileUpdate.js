import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../Component/Loading';
import styles from '../assets/style/MyProfile.module.scss';
import api from '../service/api';

const MyProfileUpdate = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        email: '',
        birthdate: '',
        gender: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                alert('로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.');
                navigate('/');
                return;
            }

            try {
                const response = await api.get(`/user/userinfo?userId=${userId}`);
                setProfileData(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = sessionStorage.getItem('userId');

        try {
            await api.put(`/user/userinfo`, {
                userId,
                ...profileData,
            });
            alert('정보가 성공적으로 수정되었습니다.');
            navigate('/myprofile');
        } catch (error) {
            console.error('정보 수정 실패:', error);
            alert('정보 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>에러메세지 : {error.message}</p>;
    }

    return (
        <div className={styles.MyProfileUpdateContainer}>
            <h1>정보 수정</h1>
            <form className={styles.profileForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">이름</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone">전화번호</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="birthdate">생년월일</label>
                    <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={profileData.birthdate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="gender">성별</label>
                    <select
                        id="gender"
                        name="gender"
                        value={profileData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                        <option value="other">기타</option>
                    </select>
                </div>

                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.saveButton}>저장</button>
                    <button type="button" className={styles.cancelButton} onClick={() => navigate('/myprofile')}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default MyProfileUpdate;
