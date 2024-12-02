import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import moment from 'moment';
import axios from 'axios';
import styles from '../assets/style/Main.module.scss';
import '../assets/style/MyCalendar.css';

const Main = () => {
    const [value, onChange] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [schedule, setSchedule] = useState({});

    // 서버에서 특정 날짜의 일정을 가져오는 함수
    const fetchSchedulesForDate = async (date) => {
        const dateString = moment(date).format('YYYY-MM-DD');
        try {
            const response = await axios.get(`/calendar/${dateString}`);
            const schedules = response.data.reduce((acc, curr) => {
                acc[curr.date] = curr.schedule;
                return acc;
            }, {});
            setSchedule(schedules);
        } catch (error) {
            console.error("일정 가져오기 실패:", error);
        }
    };

    //tileContent 함수 수정
    const scheduleTileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = moment(date).format('YYYY-MM-DD');
            return schedule[dateString] ? (
                <p style={{ color: 'wheat', fontSize: '10px' }}>{schedule[dateString]}</p>
            ) : null;
        }
    };

    // 날짜 클릭 시 패널을 여는 함수
    const onDateClick = (date) => {
        const dateString = moment(date).format('YYYY-MM-DD');
        if (schedule[dateString]) {
            setSelectedDate({ date: dateString, schedule: schedule[dateString] });
            setIsPanelOpen(true); // 패널 열기
        } else {
            setSelectedDate(null);
            setIsPanelOpen(false);
        }
    };

    // 패널 닫기 함수
    const closePanel = () => {
        setIsPanelOpen(false);
        setSelectedDate(null);
    };

    // 날짜 변경 시 서버에서 해당 날짜의 일정 조회
    useEffect(() => {
        fetchSchedulesForDate(value);
    }, [value]);  // 달력이 변경될 때마다 해당 날짜의 일정을 가져옵니다.

    // 날짜 변경 핸들러 함수
    const handleDateChange = (date) => {
        onChange(date);
    };

    // tileClassName 함수 수정
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const isNeighboringMonth =
                date.getMonth() !== value.getMonth() || date.getFullYear() !== value.getFullYear();

            const isSaturday = date.getDay() === 6;
            const isSunday = date.getDay() === 0;

            // 다음 달과 이전 달의 주말 스타일 지정
            if (isNeighboringMonth && isSaturday) return "neighboring-saturday";
            if (isNeighboringMonth && isSunday) return "neighboring-sunday";
            // 현재 달의 주말
            if (!isNeighboringMonth && isSaturday) return "current-saturday";
            if (!isNeighboringMonth && isSunday) return "current-sunday";
        }
        return null;
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.calendarContainer} no-underline`}>
                <Calendar
                    onChange={handleDateChange}
                    value={value}
                    formatDay={(local, date) => moment(date).format("D")} // 달력에 표시되는 일 자 숫자만 표시
                    locale="en"
                    calendarType="hebrew"
                    showNeighboringMonth={true}
                    next2Label={null}
                    prev2Label={null}
                    onClickDay={onDateClick} // 날짜 클릭 이벤트
                    tileContent={scheduleTileContent}
                    tileClassName={tileClassName}
                />
            </div>

            {isPanelOpen && (
                <div className={styles.sidepanel}>
                    <h3>일정</h3>
                    {selectedDate && (
                        <div>
                            <p><strong>날짜:</strong> {selectedDate.date}</p>
                            <p><strong>일정:</strong> {selectedDate.schedule}</p>
                        </div>
                    )}
                    <button onClick={closePanel} className="close-button">닫기</button>
                </div>
            )}
        </div>
    );
};

export default Main;
