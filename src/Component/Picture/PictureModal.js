import React, { useState } from 'react';
import api from '../../service/api';
import styles from '../../assets/style/Picture/PictureModal.module.scss'; // 스타일 추가

const PictureModal = ({ onClose }) => {
    const userId = sessionStorage.getItem('userId');
    const coupleId = sessionStorage.getItem('coupleId');
    const [caption, setCaption] = useState(""); // 설명 상태
    const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태
    const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기 상태

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result); // 파일 미리보기
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSavePhoto = async () => {
        if (!selectedFile || !caption) {
            alert("모든 필드를 채워주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("coupleId", coupleId);      // 커플 ID
        formData.append("uploadedBy", userId);      // 업로드한 사용자 ID
        formData.append("caption", caption);        // 설명
        formData.append("file", selectedFile);      // 선택된 파일

        // FormData 내용 확인용 로그
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await api.post('/photo/insert', formData);
            console.log('응답:', response.data);
            alert('게시물이 생성되었습니다.');
            onClose(); // 게시물 생성 후 모달 닫기
        } catch (err) {
            console.error('게시물 생성 실패:', err);
            alert('게시물 생성에 실패했습니다.');
        }
    };


    return (
        <div className={styles.modalContainer}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <h2>게시물 생성</h2>
                <div className={styles.formGroup}>
                    <label>사진 선택:</label>
                    <input type="file" onChange={handleFileChange} />
                    {previewImage && <img src={previewImage} alt="미리보기" className={styles.previewImage} />}
                </div>
                <div className={styles.formGroup}>
                    <label>설명:</label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="게시물 설명"
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <button onClick={handleSavePhoto} className={styles.saveButton}>게시물 생성</button>
                </div>
            </div>
        </div>
    );
};

export default PictureModal;
