import React, { useEffect, useState } from 'react';
import Loading from '../Component/Loading';
import styles from '../assets/style/MyProfile.module.scss';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
    const [myProfile, setMyProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserInfo = async () => {
          try {
            const response = await api.get('/user/userinfo');
            setMyProfile(response.data);
            console.log("히히",response.data)
            setLoading(false);
          } catch (error) {
            setError(error);
            setLoading(false);
          }
        };
        getUserInfo();
      }, []);

    if (loading) {
        return <div><Loading /></div>;
      }
    
      if (error) {
        return <p>에러메세지 : {error.message}</p>;
      }
    
  return (
<>
<div className={styles.MyProfileContainer}>
<h2>내 프로필</h2>
      {myProfile ? (
        <div className={styles.profileInfo}>
          <p><strong>이름:</strong> {myProfile.name}</p>
          <p><strong>이메일:</strong> {myProfile.email}</p>
          <p><strong>생년월일:</strong> {myProfile.birthdate}</p>
          <p><strong>성별:</strong> {myProfile.gender}</p>
          <p><strong>전화번호:</strong> {myProfile.phone}</p>
          <p><strong>커플 ID:</strong> {myProfile.coupleId || "미지정"}</p>
          <p><strong>생성일:</strong> {myProfile.createdAt}</p>
        </div>
      ) : (
        <p>프로필 정보를 불러올 수 없습니다.</p>
      )}
      <button
        className={styles.infobutton}
        onClick={() => navigate("/myprofileupdate")}
      >
        정보 수정
      </button>
</div>
</>
  );
};

export default MyProfile;