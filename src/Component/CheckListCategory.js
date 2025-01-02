import React, { useState, useEffect } from "react";
import styles from "../assets/style/CheckList.module.scss";
import { VscTrash } from "react-icons/vsc";

const CheckListCategory = ({ title, items, onAddItem}) => {
  const [itemList, setItemList] = useState([]);

  // 부모 컴포넌트의 items와 동기화
  useEffect(() => {
    setItemList(items.map((item) => ({
      name: item,       // 제목을 name으로 사용
      checklistId: item.checklistId,  // checklistId를 그대로 가져옵니다
      checked: false
    })));
  }, [items]);
  
  // 체크박스 상태 업데이트 및 정렬
  const handleCheck = (index) => {
    setItemList((prev) => {
      const updatedList = [...prev]; // 배열 복사
      updatedList[index].checked = !updatedList[index].checked; // 상태 변경
      return updatedList.sort((a, b) => a.checked - b.checked); // 체크된 항목 먼저 정렬
    });
  };

  // 항목 삭제
  const handleDelete = () => {
   alert('수정중');
  };
  return (
    <div className={styles.CheckListContainer}>
      <h4 className={styles.CheckListTitle}>{title}</h4>
      {items?.length > 0 ? (
        <ul className={styles.CheckList}>
          {itemList.map((item, index) => (
            <li key={`${item.name}-${index}`} className={styles.CheckListItem}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheck(index)}
              />
              <span className={item.checked ? styles.CheckedItem : styles.UncheckedItem}>
                {item.name}
              </span>
              <button
                onClick={()=> handleDelete()}
                className={styles.CheckListDelete}
              >
                <VscTrash />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <li className={styles.CheckListItem}>항목이 없습니다.</li>
      )}
      <button onClick={onAddItem} className={styles.CheckListButton}>+ 추가하기</button>
    </div>
  );
};

export default CheckListCategory;
