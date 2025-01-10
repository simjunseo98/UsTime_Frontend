import React, { useState } from 'react';
import styles from '../assets/style/ChangePasswordPage.module.scss';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 일치 확인
    if (newPassword !== confirmNewPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const userId = sessionStorage.getItem('userId');
      const payload = {
        userId,
        currentPassword,
        newPassword,
      };

      // 비밀번호 변경 요청
      await api.put('/user/changePassword', payload);
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/myprofile'); // 프로필 페이지로 이동
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <h1>비밀번호 변경</h1>
      <form onSubmit={handleSubmit} className={styles.passwordForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmNewPassword">새 비밀번호 확인</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.changeButton}>
            비밀번호 변경
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
