import React, { useState } from "react";
import styles from "../../src/assets/style/Picture/Picture.module.scss";
import Album from "../Component/Picture/Album";
import ImageModal from "../Component/Picture/ImageModal";
import PictureModal from "../Component/Picture/PictureModal"; // PictureModal 컴포넌트를 임포트
import notimage from "../assets/img/이미지 없음.jpg";

const Picture = () => {
    const coupleId = sessionStorage.getItem("coupleId");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false); 
    const [isPictureModalOpen, setIsPictureModalOpen] = useState(false); // PictureModal 상태 추가

    // 이미지 클릭 시 ImageModal 열기
    const handleImageClick = (image) => {
        if (image.photoUrl !== notimage) {
            setSelectedImage(image);
            console.log("d",image);
        }   
        setIsImageModalOpen(true);
    };

    // ImageModal 닫기
    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImage(null);
    };

    // PictureModal 열기
    const openPictureModal = () => {
        setIsPictureModalOpen(true);
    };

    // PictureModal 닫기
    const closePictureModal = () => {
        setIsPictureModalOpen(false);
    };

    return (
        <div className={styles.PictureConstainer}>
            <div className={styles.Album}>
                <Album coupleId={coupleId} onImageClick={handleImageClick} />
            </div>
            <button className={styles.PictureButton} onClick={openPictureModal}>+</button>
            
            {isImageModalOpen && <ImageModal image={selectedImage} onClose={closeImageModal} />}
            {isPictureModalOpen && <PictureModal onClose={closePictureModal} />}
        </div>
    );
};

export default Picture;
