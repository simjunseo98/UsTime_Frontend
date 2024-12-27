import React from "react";
import styles from "../assets/style/CheckList.module.scss";

// 추가할 모달 컴포넌트
const CheckListModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.ModalOverlay} onClick={onClose}>
      <div
        className={styles.ModalContent}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 모달 닫힘 방지
      >
        {children}
      </div>
    </div>
  );
};
export default CheckListModal;