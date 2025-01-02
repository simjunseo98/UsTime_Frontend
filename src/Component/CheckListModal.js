import React from "react";
import styles from "../assets/style/CheckList.module.scss";
import CheckListCategory from "./CheckListCategory";
// 추가할 모달 컴포넌트
const CheckListModal = ({ isOpen, onClose, selectedCategory, data, handleAddItem, handleDeleteItem}) => {
  if (!isOpen) return null;


  return (
    <div className={styles.ModalOverlay} onClick={onClose}>
      <div
        className={styles.ModalContent}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 모달 닫힘 방지
      >
        {selectedCategory && data[selectedCategory] ? (
        <CheckListCategory
          title={selectedCategory}
          items={data[selectedCategory]}
          onAddItem={() => {
            const newItem = prompt("추가할 항목을 입력하세요:");
            if (newItem && newItem.trim() !== "") {
              handleAddItem(selectedCategory, newItem);
            }
          }}
          onDeleteItem={handleDeleteItem}
        />
      ) : (
        <p>선택된 카테고리에 항목이 없습니다.</p>
      )}
      </div>
    </div>
  );
};
export default CheckListModal;