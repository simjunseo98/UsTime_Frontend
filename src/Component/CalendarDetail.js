import React, { useState, useEffect } from 'react';
import api from "../service/api";
import styles from '../assets/style/Main.module.scss';

const CalendarDetail = ({ selectedDate }) => {
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

    useEffect(() => {
        if (selectedDate && selectedDate.date) {
            setNewSchedule((prevSchedule) => ({
                ...prevSchedule,
                startDate: selectedDate.date,
                endDate: selectedDate.date,
            }));
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
                <h3>Schedule</h3>
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
                        <label>라벨</label>
                        <select
                            name="label"
                            value={newSchedule.label}
                            onChange={handleInputChange}
                        >
                            <option value="빨강">빨강</option>
                            <option value="파랑">파랑</option>
                            <option value="초록">초록</option>
                        </select>
                    </div>
                    <div>
                        <label>범위</label>
                        <select
                            name="scope"
                            value={newSchedule.scope}
                            onChange={handleInputChange}
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
                    <button onClick={createSchedule}>일정 생성</button>
                    <button onClick={() => setIsEditing(false)}>취소</button>
                </div>
            ) : (
                // 기존 일정 보여주는 부분
                <div className={styles.coment}>
                    {selectedDate ? (
                        selectedDate.details.length > 0 ? (
                            selectedDate.details.map((item, idx) => (
                                <div key={idx}>
                                    <p>제목: {item.title}</p>
                                    <p>설명: {item.description}</p>
                                    <p>라벨: {item.label}</p>
                                    <p>위치: {item.location}</p>
                                    <p>작성자: {item.createdBy}</p>
                                    <p>공개 범위: {item.scope}</p>
                                    <p>작성일: {item.createdAt}</p>
                                    <br />
                                </div>
                            ))
                        ) : (
                            <p>일정이 없습니다.</p>
                        )
                    ) : (
                        <p>날짜를 선택하거나 새로운 일정을 추가하세요!</p>
                    )}
                    <button onClick={() => setIsEditing(true)}>일정 추가</button>
                </div>
            )}
        </div>
    );
};

export default CalendarDetail;
