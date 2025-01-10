import React, { useState } from 'react';
import CalendarComponent from '../Component/Calendar/CalendarComponent';
import CalendarDetail from '../Component/Calendar/CalendarDetail';
import styles from '../assets/style/Main.module.scss';
import '../assets/style/MyCalendar.css';

// 메인 페이지
const Main = () => {
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜의 상세 일정
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false); // 사이드 패널 열림 상태

    return (
        <div className={styles.container}>
            {/* 달력 컴포넌트 */}
            <CalendarComponent
                setSelectedDate={(date) => {
                    setSelectedDate(date); // 선택된 날짜 설정
                    setIsSidePanelOpen(true); // 사이드 패널 열기
                }}
            />
            {/* 사이드 패널 조건부 렌더링 */}
            {isSidePanelOpen && (
                <CalendarDetail
                    selectedDate={selectedDate} // 선택된 날짜 전달
                    onClose={() => setIsSidePanelOpen(false)} // 닫기 버튼 콜백
                />
            )}
        </div>
    );
};

export default Main;
