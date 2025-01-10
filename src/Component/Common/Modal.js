import React from "react";
import styles from '../../assets/style/Modal.module.scss';

const Modal=( {isOpen , onClose , children}) => {
    if(!isOpen) return null;
  return(
    <div className={styles.modalContainer}>
        <div className={styles.modalSection} onClick={(e)=>e.stopPropagation()}>
         <button className={styles.modalClose} onClick={onClose}>X</button>
         {children}
        </div>
    </div>
  );
}
export default Modal;