import React from "react";
import styles from '../../assets/style/Picture/ImageModal.module.scss'; 

const ImageModal = ( {image, onClose}) => {
    if(!image) return null;
    return (
        <div className={styles.ModalOverlay} onClick={onClose}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <img src={image.photoUrl} alt={image.photoTitle} className={styles.modalImage} />
                <p>{image.photoTitle}</p>
            </div>
        </div>
    );
};

export default ImageModal;