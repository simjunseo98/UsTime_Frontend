import React, {useState, useEffect} from "react";
import api from "../../service/api";
import styles from '../../assets/style/Calendar/Main.module.scss';
import { getLabelColor } from '../../utils/getLabelColor';
import { VscArrowLeft, VscEdit, VscLocation, VscTrash } from "react-icons/vsc";

const CalendarDetail = ({ selectedDate,fetchCalendar }) => {
  // 세션에서 coupleId와 createdBy를 가져옵니다.
  const isCoupleId = sessionStorage.getItem('coupleId');
  const coupleId = isCoupleId === null || isCoupleId === 'undefined' ? null : isCoupleId;
  const createdBy = sessionStorage.getItem('userId');

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
    label: '빨강',
    location: '',
    scope: coupleId ? '공유' : '개인',  //coupleId가 없으면 초기값 개인으로 세팅
  });


  // 날짜 변경 시 상세보기 목록 초기화
  useEffect(() => {
    setSelectedDetailIndex(null);
    setIsEditing(false);
  }, [selectedDate]);

  // 새로운 일정 데이터 초기화
  useEffect(() => {
    if (selectedDate && selectedDate.date) {
      const localDate = new Date(selectedDate.date);
      localDate.setHours(localDate.getHours() + 9);

      const formattedDate = localDate.toISOString().split('T')[0];
      setNewSchedule((prevSchedule) => ({
        ...prevSchedule,
        startDate: formattedDate,
        endDate: formattedDate,
      }));
      setIsAdd(false);
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

    const scheduleData = {
      coupleId: coupleId || null,
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
      alert("일정이 추가 되었습니다.");
      setIsAdd(false);
      setIsEditing(false);
      fetchCalendar();
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
    const coupleId = sessionStorage.getItem('coupleId');
    //수정한 일정 데이터 유효성 검사
    if (!editedSchedule.title || !editedSchedule.description || !editedSchedule.location || !editedSchedule.scope ||
      !editedSchedule.startDate || !editedSchedule.endDate) {
      alert('모든 필드를 채워주세요.');
      return;
    }
    try {
      await api.put(`/calendar/update`, {
        createdBy: userId,
        coupleId,
        ...editedSchedule,
      });
      alert('일정이 성공적으로 수정되었습니다.');
      setIsEditing(false);
      fetchCalendar();
    } catch (error) {
      console.error('일정 수정 실패:', error);
      console.log("스케줄 아이디 있누",editedSchedule.scheduleId);
      alert('일정 수정에 실패했습니다.');
    }
  };

  // 일정 삭제 함수
  const deleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/calendar/delete?scheduleId=${scheduleId}`);
      alert('일정이 삭제되었습니다.');
      fetchCalendar();
      window.location.reload();
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
    setIsEditing(false);
  };


  return (
    <div className={styles.sidepanel}>
      <div className={styles.scheduleHeader}>
        <div className={styles.left}>Schedule</div>
        <div className={styles.right}>
          <button onClick={() => setIsAdd(true)} className={styles.addSchedule}>+</button>
          <button className={styles.closeButton}>X</button>
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
          <span>날짜를 선택하세요!</span>
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
            <div style={{ display: 'flex', gap: '30px', margin: '5px' }}>
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
              {coupleId && <option value="공유">공유</option>}
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
            <div className={styles.detailHeaderButtons}>
          <button
                className={styles.detailScheduleButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditing(selectedDetailIndex);
                }}
              > <VscEdit />
              </button>
              {/* 삭제 버튼 */}
              <button
                onClick={() => deleteSchedule(selectedDate.details[selectedDetailIndex]?.scheduleId)}
                className={styles.detailScheduleButton}
              ><VscTrash />
              </button>
              <button
                onClick={handleBackToList}
                className={styles.detailScheduleButton}
              ><VscArrowLeft />
              </button>
              </div>
              <div className={styles.detailTitle}>
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

          <div className={styles.detailFooter}> 
          <div className={styles.detailDate}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
          </div> 
          <div className={styles.location}>
              <VscLocation />
              {isEditing ? (
                <input
                  type='text'
                  name='location'
                  value={editedSchedule.location || ''}
                  onChange={handleInputEditing}>
                </input>
              ) : (
                <p>{selectedDate.details[selectedDetailIndex]?.location || '위치 없음'}</p>
              )}
            </div>

            <div className={styles.detailScope}>
              <label>공유 범위:</label>
              {isEditing ? (
                <select
                  name='scope'
                  value={editedSchedule.scope || ''}
                  onChange={handleInputEditing}
                >
                  {coupleId && <option value="공유">공유</option>}
                  <option value="개인">개인</option>
                </select>

              ) : (
                <p>{selectedDate.details[selectedDetailIndex]?.scope || ''}</p>
              )}
            </div>

            <div className={styles.detailCreatedAt}>
          <label>작성일: </label>
          <p>{selectedDate.details[selectedDetailIndex]?.createdAt || ''}</p></div>
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
                      <p
                        className={styles.scheduleTitles}
                        onClick={() => handleTitleClick(idx)}
                        style={{ backgroundColor: getLabelColor(item.label) }}
                      >
                        {item.title}
                      </p>

                      <button
                        onClick={() => deleteSchedule(selectedDate.details[idx]?.scheduleId)}
                        className={styles.detailScheduleButton}
                      >
                        <VscTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>일정이 없습니다.</p>
              )
            ) : (
              <p>날짜를 선택하거나 
              <br/>
                새로운 일정을 추가하세요!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDetail;
