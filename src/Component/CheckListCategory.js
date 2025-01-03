import React, { useState, useEffect } from "react";
import styles from "../assets/style/CheckList.module.scss";
import { VscTrash } from "react-icons/vsc";
import api from "../service/api.js";

const CheckListCategory = ({title,items, onAddItem,onDeleteItem}) => {
  const [itemList, setItemList] = useState([]);

  // 부모 컴포넌트의 items와 동기화
  useEffect(() => {
    console.log("CheckListCategory에 전달된 items:", items); // 전달된 데이터 확인
    setItemList(items); // 상태 업데이트
  }, [items]); // items가 변경될 때마다 이 useEffect가 호출됨
  
  // 체크 상태 변경 및 checklistId 추출
  const handleCheck = async (index) => {
    const updatedList = [...itemList];
    const currentItem = updatedList[index];

    try {
      // checklistId를 사용하여 서버에 상태 업데이트 요청
      await api.put(`/check/update/${currentItem.checklistId}`, {
        checked: !currentItem.checked,
      });

      // 상태 변경 및 정렬
      currentItem.checked = !currentItem.checked;
      setItemList(updatedList.sort((a, b) => a.checked - b.checked));

      // 체크리스트 ID 출력
    } catch (error) {
      console.error("체크 상태 업데이트 실패:", error);
      console.log("체크리스트 ID:", currentItem.checklistId);
    }
  };

  // 항목 삭제
  const handleDelete = async (checklistId) => {
    try {
      // 서버에서 항목 삭제 요청
      await api.delete(`/check/delete?checklistId=${checklistId}`);

      // 부모 컴포넌트에서 삭제된 항목을 처리하는 함수 호출
      onDeleteItem(checklistId); // 부모에서 삭제 처리
    } catch (error) {
      console.error("항목 삭제 실패:", error);
      alert("항목 삭제 중 오류가 발생했습니다.");
    }
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
                {item.title}
              </span>
              <button
                onClick={()=> handleDelete(item.checklistId)}
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
