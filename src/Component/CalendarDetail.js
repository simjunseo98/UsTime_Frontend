import React from 'react';
import styles from '../assets/style/Main.module.scss';

const CalendarDetail = ({ selectedDate }) => {
    return (
        <div className={styles.sidepanel}>
            <div className={styles.scheduleHeader}>
                <h3>Schedule</h3>
            </div>
            {selectedDate ? (
                <div className={styles.coment}>
                    {selectedDate.details.length > 0 ? (
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
                    )}
                </div>
            ) : (
                <div className={styles.coment}>
                    <p>날짜를 선택하거나 새로운 일정을 추가하세요!</p>
                </div>
            )}
        </div>
    );
};

export default CalendarDetail;
