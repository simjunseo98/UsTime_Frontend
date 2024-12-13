import React, { useState, useEffect } from 'react';
import api from "../service/api";
import styles from '../assets/style/Main.module.scss';

const CalendarDetail = ({ selectedDate,onClose}) => {
    const [selectedDetailIndex, setSelectedDetailIndex] = useState(null); // 클릭된 제목의 인덱스 상태
    const [isEditing, setIsEditing] = useState(false); // 일정 추가/수정 여부
    const [newSchedule, setNewSchedule] = useState({
        title: '',
        description: '',
        startDate: selectedDate ? selectedDate.date : '',
        endDate: selectedDate ? selectedDate.date : '', // startDate와 같은 날짜로 기본 설정
        label: '빨강',
        location: '',
        scope: '공유',
    });

    // 세션에서 coupleId와 createdBy를 가져옵니다.
    const coupleId = Number(sessionStorage.getItem('coupleId'));
    const createdBy = Number(sessionStorage.getItem('userId'));

    const handleTitleClick = (idx) => {
        setSelectedDetailIndex(idx); // 클릭된 제목의 인덱스를 저장
      };
    
      const handleBackToList = () => {
        setSelectedDetailIndex(null); // 상세 보기에서 목록으로 돌아가기
      };
    
    useEffect(() => {
        if (selectedDate && selectedDate.date) {
            setNewSchedule((prevSchedule) => ({
                ...prevSchedule,
                startDate: selectedDate.date,
                endDate: selectedDate.date,
            }));
            setIsEditing(false);//날짜 변경시  편집 모드 초기화
        }
    }, [selectedDate]);

    // 폼 입력 처리 함수
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSchedule((prevSchedule) => ({
            ...prevSchedule,
            [name]: value,
        }));
    };

    // 일정 생성 함수
    const createSchedule = async () => {
        if (!coupleId || !createdBy) {
            console.error("Couple ID 또는 CreatedBy가 없습니다.");
            return;
        }

        const scheduleData = {
            coupleId,
            title: newSchedule.title,
            description: newSchedule.description,
            startDate: newSchedule.startDate,
            endDate: newSchedule.endDate,
            label: newSchedule.label,
            location: newSchedule.location,
            createdBy,
            scope: newSchedule.scope,
        };

        try {
            await api.post('/calendar/create', scheduleData); // 서버에 일정 생성 요청
            console.log("보낸 데이터: ", scheduleData);
            alert('일정이 추가 되었습니다.')
            setIsEditing(false);
            // 일정 추가 후 페이지 새로 고침
            window.location.reload(); // 페이지 새로 고침
        } catch (error) {
            console.error("일정 생성 실패:", error);
        }
    };
    
    return (
        <div className={styles.sidepanel}>
            <div className={styles.scheduleHeader}>
                <div className={styles.left}>Schedule</div>
                <div className={styles.right}>
            <button onClick={() => setIsEditing(true)} className={styles.addSchedule}>+</button>
                <button onClick={onClose} className={styles.closeButton}>X</button></div></div>
              <div className={styles.nowDate}>
       {selectedDate && selectedDate.date ? (
            <span>{new Date(selectedDate.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })}</span>
      ) : (
            <span>...</span> // 선택된 날짜가 없을 때 메시지 표시
        )}
    </div>
            

            {isEditing ? (
                // 일정 추가 폼
                <div className={styles.scheduleForm}>
                    <div>
                        <label>제목</label>
                        <input
                            type="text"
                            name="title"
                            value={newSchedule.title}
                            onChange={handleInputChange}
                            placeholder="일정 제목"
                        />
                    </div>
                    <div>
                        <label>설명</label>
                        <input
                            type="text"
                            name="description"
                            value={newSchedule.description}
                            onChange={handleInputChange}
                            placeholder="일정 설명"
                        />
                    </div>
                    <div>
                        <label>위치</label>
                        <input
                            type="text"
                            name="location"
                            value={newSchedule.location}
                            onChange={handleInputChange}
                            placeholder="위치"
                        />
                    </div>
                    <div>
    <label>색상</label>
    <div style={{ display: 'flex', gap: '30px',margin:'7px' }}>
        {['빨강', '파랑', '초록'].map((color) => (
            <div
                key={color}
                onClick={() => setNewSchedule((prevSchedule) => ({ ...prevSchedule, label: color }))}
                style={{
                    width: '25px',
                    height: '25px',
                    backgroundColor: color === '빨강' ? 'red' : color === '파랑' ? 'blue' : 'green',
                    border: newSchedule.label === color ? '2px solid black' : '1px solid gray',
                    cursor: 'pointer',
                    borderRadius: '50px',
                }}
                title={color} // 마우스 올리면 색상 이름 표시
            />
        ))}
    </div>
</div>

                    <div>
                        <label>범위</label>
                        <select
                            name="scope"
                            value={newSchedule.scope}
                            onChange={handleInputChange}
                            className={styles.select}
                             placeholder="공유"
                        >
                            <option value="공유">공유</option>
                            <option value="개인">개인</option>
                        </select>
                    </div>
                    <div>
                        <label>시작일</label>
                        <input
                            type="date"
                            name="startDate"
                            value={newSchedule.startDate}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <div>
                        <label>종료일</label>
                        <input
                            type="date"
                            name="endDate"
                            value={newSchedule.endDate}
                            onChange={handleInputChange}
                        />
                    </div>               
                    <button onClick={createSchedule} className={styles.detailButton}>생성</button>
                    <button onClick={() => setIsEditing(false)} className={styles.detailButton}>취소</button>
        
                </div>
           ) : selectedDetailIndex !== null ? (
            // 클릭된 제목의 상세 정보 보기
            <div className={styles.detailContainer}>
              <button
                onClick={handleBackToList}
                className={styles.backButton}
              >
                목록으로 돌아가기
              </button>
              <div>
                <p>제목: {selectedDate.details[selectedDetailIndex].title}</p>
                <p>
                  설명: {selectedDate.details[selectedDetailIndex].description}
                </p>
                <p>라벨: {selectedDate.details[selectedDetailIndex].label}</p>
                <p>위치: {selectedDate.details[selectedDetailIndex].location}</p>
                <p>공개 범위: {selectedDate.details[selectedDetailIndex].scope}</p>
                <p>
                  작성일: {selectedDate.details[selectedDetailIndex].createdAt}
                </p>
              </div>
            </div>
          ) : (
            // 기존 일정 목록 표시
            <div className={styles.scheduleContainer}>
              <div className={styles.comentContainer}>
                {selectedDate && selectedDate.details ? (
                    selectedDate.details.length > 0 ? (
                        selectedDate.details.map((item, idx) => (
                            <div key={idx}>
                                <div className={styles.coment}>
                          <p>색깔자리</p>
                        <p
                          className={styles.scheduleTitles}
                          onClick={() => handleTitleClick(idx)}
                          style={{backgroundColor:item.color}}
                          >
                          {item.title}
                        </p>
                            </div>
                      </div>
                    ))
                  ) : (
                    <p>일정이 없습니다.</p>
                  )
                ) : (
                  <p>날짜를 선택하거나 새로운 일정을 추가하세요!</p>
                )}
              </div>
            </div>
          )}
        </div>
      );
    };
    
    export default CalendarDetail;