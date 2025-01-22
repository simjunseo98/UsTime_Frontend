import React, { useEffect, useState } from 'react';
import Loading from '../Component/Common/Loading';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../assets/img/이미지 없음.jpg';
import styles from '../assets/style/Profile/MyProfile.module.scss';
import Modal from '../Component/Common/Modal';
import UserSearch from '../Component/UserSearch';

const MyProfile = () => {
    const userId = sessionStorage.getItem('userId');
    const [myProfile, setMyProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await api.get(`/user/userinfo?userId=${userId}`);
                setMyProfile(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        getUserInfo();
    }, [userId, navigate]);

    // 커플 해지
    const handleUnlinkCouple = async () => {
        const coupleId = myProfile.coupleId;
        const isConfirmed = window.confirm('정말로 커플 관계를 해지하시겠습니까?');

        if (!isConfirmed) {
            return; // 사용자가 취소하면 메소드 실행을 중지합니다.
        }

        try {
            await api.delete(`/couple/delete?coupleId=${coupleId}`);
            setMyProfile((prev) => ({
                ...prev,
                coupleId: null,
            }));
            sessionStorage.removeItem("coupleId");
            alert('커플 관계가 해지되었습니다.');
            window.location.reload();
        } catch (err) {
            console.error('커플 해지 실패:', err);
            alert('커플 해지에 실패했습니다.');
        }
    };

    // 프로필 바꾸기
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 허용된 MIME 타입인지 확인
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert('JPEG 또는 PNG 형식의 이미지만 업로드 가능합니다.');
            return;
        }

        // 파일 크기 제한 (5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
            alert('파일 크기는 5MB를 초과할 수 없습니다.');
            return;
        }

        // 미리보기 이미지 업데이트
        setPreviewImage(URL.createObjectURL(file));
        setSelectedFile(file); // 선택된 파일 저장
    };

    // 프로필 바꾸기 저장
    const handleSaveProfileImage = async () => {
        if (!selectedFile) {
            alert('변경할 프로필 사진을 선택하세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('userId', userId);

        try {
            const response = await api.post('/user/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('프로필 사진이 성공적으로 변경되었습니다.');
            setMyProfile((prev) => ({
                ...prev,
                profileImageUrl: response.data.profileImageUrl,
            }));
        } catch (err) {
            console.error('프로필 사진 변경 실패:', err);
            alert('프로필 사진 변경에 실패했습니다.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMyProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // 정보수정
    const handleSave = async () => {
        try {
            await api.put(`/user/update`, {
                userId,
                ...myProfile,
            });
            alert('정보가 성공적으로 수정되었습니다.');
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            console.error('정보 수정 실패:', err);
            alert('정보 수정에 실패했습니다.');
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>에러메세지 : {error.message}</p>;
    }

    return (
        <div className={styles.MyProfileContainer}>
            <div className={styles.profileWrapper}>
                <div className={styles.profileHeader}>
                    <h1>내 프로필</h1>
                    {!isEditing && (
                        <button
                            className={styles.editButton}
                            onClick={() => setIsEditing(true)}
                        >
                            정보 수정
                        </button>
                    )}
                    {isEditing && (
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.saveButton}
                                onClick={handleSave}
                            >
                                저장
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setIsEditing(false)}
                            >
                                취소
                            </button>
                        </div>
                    )}
                </div>
                <div className={styles.profileContent}>
                    <div className={styles.profileImageSection}>
                        <img
                            src={previewImage || myProfile.profileUrl || defaultImage}
                            alt="프로필 사진"
                            className={styles.profileImage}
                        />
                        <p>
                            <strong>이름:</strong>{' '}
                            {isEditing ? (
                                <input
                                    className={styles.editInput}
                                    type="text"
                                    name="name"
                                    value={myProfile.name}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                myProfile.name
                            )}
                        </p>
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={handleFileChange}
                            className={styles.fileInput} // 숨김 처리
                        />
                        <button
                            className={styles.editButton}
                            onClick={handleSaveProfileImage} // 확인 버튼을 눌러서 저장
                        >
                            사진바꾸기
                        </button>
                    </div>

                    <div className={styles.profileDetails}>
                        <p>
                            <strong>전화번호:</strong>{' '}
                            {isEditing ? (
                                <input
                                    className={styles.editInput}
                                    type="text"
                                    name="phone"
                                    value={myProfile.phone}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                myProfile.phone
                            )}
                        </p>
                        <p>
                            <strong>이메일:</strong>{' '}
                            {isEditing ? (
                                <input
                                    className={styles.editInput}
                                    type="email"
                                    name="email"
                                    value={myProfile.email}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                myProfile.email
                            )}
                        </p>
                        <p>
                            <strong>생년월일:</strong>{' '}
                            {isEditing ? (
                                <input
                                    className={styles.editInput}
                                    type="date"
                                    name="birthdate"
                                    value={myProfile.birthdate}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                myProfile.birthdate
                            )}
                        </p>
                    </div>
                    <div className={styles.profileDetails2}>
                        <p>
                            <strong>성별:</strong>{' '}
                            {isEditing ? (
                                <select
                                    className={styles.editInput}
                                    name="gender"
                                    value={myProfile.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="male">남성</option>
                                    <option value="female">여성</option>
                                </select>
                            ) : (
                                myProfile.gender
                            )}
                        </p>
                        <p>
                            <strong>커플 ID:</strong> {myProfile.coupleId || '미지정'}
                            <button
                                className={styles.matchingButton}
                                onClick={() => setOpenModal(true)}
                            >
                                연동
                            </button>
                            {myProfile.coupleId && (
                                <button
                                    className={styles.deleteButton}
                                    onClick={handleUnlinkCouple} // 커플 해지
                                >
                                    해지
                                </button>
                            )}
                        </p>

                        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                            <h3 className={styles.modalHeader}>커플신청 보낼 사람</h3>
                            <UserSearch
                                onSelectUser={() => {
                                    setOpenModal(false);
                                }}
                            />
                        </Modal>
                        <p>
                            <strong>생성일:</strong>{' '}
                            {new Date(myProfile.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
