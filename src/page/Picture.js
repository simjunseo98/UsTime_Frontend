import React, { useState } from "react";
import styles from "../../src/assets/style/Picture/Picture.module.scss";
import Album from "../Component/Picture/Album";
import ImageModal from "../Component/Picture/ImageModal";
import notimage from "../assets/img/이미지 없음.jpg";

const Picture = () =>{
const coupleId = sessionStorage.getItem("coupleId");
const [selectedImage, setSelectedImage] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false); 

      //모달 열기 핸들러
      const handleImageClick = (image) => {
        if(image.photoUrl !== notimage)
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };
    return(
        <div className={styles.PictureConstainer}>
           <div className={styles.Album}>
            <Album coupleId={coupleId} onImageClick={handleImageClick}/>
            </div>
            <button className={styles.PictureButton}>+</button>
            {isModalOpen &&<ImageModal image={selectedImage} onClose={closeModal}/>}
        </div>
    );
};

export default Picture;