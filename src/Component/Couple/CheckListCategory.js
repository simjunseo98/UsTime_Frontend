import React, { useState, useEffect } from "react";
import styles from "../../assets/style/Couple/CheckList.module.scss";
import { VscTrash } from "react-icons/vsc";
import api from "../../service/api.js";

const CheckListCategory = ({title,items, onAddItem,onDeleteItem}) => {
  const [itemList, setItemList] = useState(items ||[]);


  // 부모 컴포넌트의 items와 동기화
  useEffect(() => {
    setItemList(items); // 상태 업데이트
  }, [items]); // items가 변경될 때마다 이 useEffect가 호출됨
  
  // 체크 상태 변경
  const handleCheck = async (index) => {
    try {
        // 유효성 검사
    const currentItem = itemList?.[index];
    if (!currentItem) {
      console.error("잘못된 index 또는 itemList가 비어 있습니다.");
      return;
    }
      const isChecked = !currentItem.isChecked;
      const url = `/check/update/${currentItem.checklistId}?isChecked=${isChecked}`;
      // 서버 요청
      await api.put(url);
  
      // 상태 업데이트
      setItemList((prevList) =>
        prevList.map((item, i) =>
          i === index ? { ...item, isChecked: !item.isChecked } : item
        )
      );
    } catch (error) {
      console.error("체크 상태 업데이트 실패:", error);
    }
  };
  

  // 항목 삭제
  const handleDelete = async (checklistId) => {
    const confirmDelete = window.confirm("정말로 이 항목을 삭제하시겠습니까?");
  if (!confirmDelete) return;
    try {
      // 서버에서 항목 삭제 요청
      await api.delete(`/check/delete/${checklistId}`);
      
      // 부모 컴포넌트에서 삭제된 항목을 처리하는 함수 호출
      onDeleteItem(checklistId); // 부모에서 삭제 처리
      window.location.reload();
    } catch (error) {
      console.error("항목 삭제 실패:", error.response ? error.response.data : error);
      alert("항목 삭제 중 오류가 발생했습니다.");
    }
  };
  return (
    <div className={styles.CheckListContainer}>
      <h4 className={styles.CheckListTitle}>{title}</h4> 
      {items?.length > 0 ? (
        <ul className={styles.CheckList}>
          {itemList.map((item, index) => (
            <li key={item.checklistId} className={styles.CheckListItem}>
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() =>{ 
                  console.log("체크 확인",item.isChecked);
                  handleCheck(index)}}
              />
              <span className={item.isChecked ? styles.CheckedItem : styles.UncheckedItem}>
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
