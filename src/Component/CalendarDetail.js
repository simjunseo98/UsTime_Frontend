import React, { useState, useEffect } from 'react';
import api from "../service/api";
import styles from '../assets/style/Main.module.scss';
import { VscArrowLeft, VscEdit, VscLocation, VscTrash } from "react-icons/vsc";

const CalendarDetail = ({ selectedDate, onClose }) => {
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(null); // 클릭된 일정의 인덱스
  const [isAdd, setIsAdd] = useState(false); // 일정 추가 여부
  const [schedule, setSchedule] = useState(null); // 수정할 일정 인덱스
  const [editedSchedule, setEditedSchedule] = useState({}); // 수정된 일정 데이터
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    description: '',
    startDate: selectedDate ? selectedDate.date : '',
    endDate: selectedDate ? selectedDate.date : '',
    label: '빨강', // 기본 색상
    location: '',
    scope: '공유', // 기본 범위
  });

  // 세션에서 coupleId와 createdBy를 가져옵니다.
  const coupleId = Number(sessionStorage.getItem('coupleId'));
  const createdBy = Number(sessionStorage.getItem('userId'));

  // 날짜 변경 시 상세보기 목록 초기화
  useEffect(() => {
    setSelectedDetailIndex(null);
    setIsEditing(false);
  }, [selectedDate]);

  // 새로운 일정 데이터 초기화
  useEffect(() => {
    if (selectedDate && selectedDate.date) {
      // 한국 시간으로 날짜 조정 (UTC에서 9시간 차이)
      const localDate = new Date(selectedDate.date);
      localDate.setHours(localDate.getHours() + 9); // UTC에서 9시간 더하기

      const formattedDate = localDate.toISOString().split('T')[0];
      setNewSchedule((prevSchedule) => ({
        ...prevSchedule,
        startDate: formattedDate,
        endDate: formattedDate,
      }));
      setIsAdd(false); // 날짜 변경 시 편집 모드 초기화
    }
  }, [selectedDate]);

  // 입력값 변경 처리
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
      alert('일정이 추가 되었습니다.');
      setIsAdd(false);
      window.location.reload(); // 페이지 새로 고침
    } catch (error) {
      console.error("일정 생성 실패:", error);
    }
  };

  // 일정 수정 모드로 전환
  const handleEditing = (idx) => {
    setSchedule(idx);
    setIsEditing(true);
  };

  // 일정 수정 데이터 설정
  useEffect(() => {
    if (schedule !== null && selectedDate && selectedDate.details) {
      setEditedSchedule(selectedDate.details[schedule]);
    }
  }, [schedule, selectedDate]);

  // 수정 입력값 처리
  const handleInputEditing = (e) => {
    const { name, value } = e.target;
    setEditedSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 수정한 일정 저장
  const handleSaveEdit = async () => {
    const userId = sessionStorage.getItem('userId');
    try {
      await api.put(`/calendar/update`, {
        userId,
        ...editedSchedule,
      });
      alert('일정이 성공적으로 수정되었습니다.');
      setIsEditing(false);
      setSchedule(null);
      window.location.reload();
    } catch (error) {
      console.error('일정 수정 실패:', error);
      alert('일정 수정에 실패했습니다.');
    }
  };

  // 일정 삭제 함수
  const deleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/calendar/delete?scheduleId=${scheduleId}`);
      alert('일정이 삭제되었습니다.');
      window.location.reload(); // 페이지 새로 고침
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      alert('일정 삭제에 실패했습니다.');
    }
  };

  // 제목 클릭 시 상세보기 활성화
  const handleTitleClick = (idx) => {
    setSelectedDetailIndex(idx);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setSelectedDetailIndex(null);
  };

  const getLabelColor = (label) => {
    switch (label) {
      case '빨강':
        return '#ff6347';
      case '초록':
        return '#32cd32';
      case '파랑':
        return '#1e90ff';
      case '핑크':
        return '#f89cf0';
      case '보라':
        return '#7a3689';
      default:
        return '#d3d3d3';
    }
  };

  return (
    <div className={styles.sidepanel}>
      <div className={styles.scheduleHeader}>
        <div className={styles.left}>Schedule</div>
        <div className={styles.right}>
          <button onClick={() => setIsAdd(true)} className={styles.addSchedule}>+</button>
          <button onClick={onClose} className={styles.closeButton}>X</button>
        </div>
      </div>

      {/* 날짜 표시 */}
      <div className={styles.nowDate}>
        {selectedDate && selectedDate.date ? (
          <span>{new Date(selectedDate.date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</span>
        ) : (
          <span>...</span>
        )}
      </div>

      {/* 일정 추가 폼 */}
      {isAdd ? (
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
            <div style={{ display: 'flex', gap: '30px', margin: '7px' }}>
              {['빨강', '파랑', '초록', '핑크', '보라'].map((color) => (
                <div
                  key={color}
                  onClick={() => setNewSchedule((prevSchedule) => ({ ...prevSchedule, label: color }))}
                  style={{
                    width: '25px',
                    height: '25px',
                    backgroundColor: color === '빨강' ? 'red' : color === '파랑' ? 'blue' :
                      color === '초록' ? 'green' : color === '핑크' ? 'pink' : 'purple',
                    border: newSchedule.label === color ? '2px solid black' : '1px solid gray',
                    cursor: 'pointer',
                    borderRadius: '50px',
                  }}
                  title={color}
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
          <button onClick={() => setIsAdd(false)} className={styles.detailButton}>취소</button>
        </div>
      ) : selectedDetailIndex !== null ? (
        // 상세보기 모드
        <div className={styles.detailContainer}>
          <div className={styles.detailHeader}>
            <div className={styles.left}>
              <span>제목:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={editedSchedule.title || ''}
                  onChange={handleInputEditing}
                  className={styles.detailEditingInputField}
                />
              ) : (
                <p>{selectedDate.details[selectedDetailIndex]?.title || '제목 없음'}</p>
              )}
            </div>
            <div className={styles.right}>
              <button
                className={styles.detailScheduleButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditing(selectedDetailIndex);
                }}
              >
                <VscEdit />
              </button>

              {/* 삭제 버튼 */}
              <button
                onClick={() => deleteSchedule(selectedDate.details[selectedDetailIndex]?.scheduleId)}
                className={styles.detailScheduleButton}
              >
                <VscTrash />
              </button>

              <button
                onClick={handleBackToList}
                className={styles.detailScheduleButton}
              >
                <VscArrowLeft />
              </button>
            </div>
          </div>

          <div className={styles.detailDescription}>
            <span>설명:</span>
            {isEditing ? (
              <textarea
                name="description"
                value={editedSchedule.description || ''}
                onChange={handleInputEditing}
                className={styles.textArea}
              />
            ) : (
              <p>{selectedDate.details[selectedDetailIndex]?.description || '내용 없음'}</p>
            )}
          </div>

          <div className={styles.detailDate}>
            <label>시작일:</label>
            {isEditing ? (
              <input
                type="date"
                name="startDate"
                value={editedSchedule.startDate || ''}
                onChange={handleInputEditing}
              />
            ) : (
              <p>{selectedDate.details[selectedDetailIndex]?.startDate}</p>
            )}
          </div>
          <div className={styles.detailDate}>
            <label>종료일:</label>
            {isEditing ? (
              <input
                type="date"
                name="endDate"
                value={editedSchedule.endDate || ''}
                onChange={handleInputEditing}
              />
            ) : (
              <p>{selectedDate.details[selectedDetailIndex]?.endDate}</p>
            )}
          </div>

          <div className={styles.detailFooter}>
            <div className={styles.location}><VscLocation />
              <p>{selectedDate.details[selectedDetailIndex]?.location || '위치 없음'}</p>
            </div>
            <div className={styles.detailScope}>
              <p>공유 범위: {selectedDate.details[selectedDetailIndex]?.scope || ''}</p>
              <p>작성일: {selectedDate.details[selectedDetailIndex]?.createdAt || ''}</p>
            </div>
          </div>

          {/* 수정 버튼 */}
          {isEditing && (
            <div className={styles.buttonContainer}>
              <button onClick={handleSaveEdit} className={styles.detailButton}>
                저장
              </button>
              <button onClick={() => setIsEditing(false)} className={styles.detailButton}>
                취소
              </button>
            </div>
          )}
        </div>
      ) : (
        // 일정 목록 표시
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
                        style={{ backgroundColor: getLabelColor(item.label) }} // 색상
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
