import React, { useState, useEffect } from "react";
import styles from "../assets/style/CheckList.module.scss";

const CheckListCategory = ({ title, items, onAddItem }) => {
  const [itemList, setItemList] = useState([]);

  // 부모 컴포넌트의 items와 동기화
  useEffect(() => {
    setItemList(items.map((item) => ({ name: item, checked: false })));
  }, [items]);

  // 체크박스 상태 업데이트 및 정렬
  const handleCheck = (index) => {
    setItemList((prev) => {
      const updatedList = prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      );
      return updatedList.sort((a, b) => a.checked - b.checked);
    });
  };

  return (
    <div className={styles.CheckListContainer}>
      <h4 className={styles.CheckListTitle}>{title}</h4>
      <ul className={styles.CheckList}>
        {itemList.map((item, index) => (
          <li key={`${item.name}-${index}`} className={styles.CheckListItem}>
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => handleCheck(index)}
            />
            <span
              className={
                item.checked ? styles.CheckedItem : styles.UncheckedItem
              }
            >
              {item.name}
            </span>
          </li>
        ))}
      </ul>
      
      <button onClick={onAddItem} className={styles.CheckListButton}>+ 추가하기</button>
    </div>
  );
};

export default CheckListCategory;
