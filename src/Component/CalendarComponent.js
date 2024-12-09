import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import moment from 'moment';
import styles from '../assets/style/Main.module.scss';
import api from "../service/api";

const CalendarComponent = ({ setSelectedDate }) => {
    const [value, onChange] = useState(new Date()); // 달력의 현재 날짜 상태
    const [schedules, setSchedules] = useState({}); // 전체 일정을 저장하는 객체

    /* 전체 일정 조회 함수 */
    const fetchAllSchedules = async () => {
        try {
            const response = await api.get('/calendar/all');
            console.log("전체 일정 데이터:", response.data);

            const scheduleData = response.data.reduce((acc, curr) => {
                const dateString = moment(curr.startDate).format('YYYY-MM-DD');
                if (!acc[dateString]) {
                    acc[dateString] = []; // 해당 날짜에 일정이 없으면 배열을 초기화
                }
                acc[dateString].push({
                    title: curr.title,
                    label: curr.label,
                });
                return acc;
            }, {});

            setSchedules(scheduleData); // 전체 일정 저장
        } catch (error) {
            console.error("전체 일정 가져오기 실패:", error);
        }
    };

    /* 특정 날짜 일정 조회 함수 */
    const fetchSchedulesForDate = async (date) => {
        const coupleId = sessionStorage.getItem('coupleId');
        if (!coupleId) {
            console.error("Couple ID가 없습니다.");
            return;
        }
        try {
            const response = await api.get(`/calendar/${date}`, {
                params: { coupleId },
            });

            setSelectedDate({
                date,
                details: response.data,
            });
        } catch (error) {
            console.error(`특정 날짜(${date}) 일정 가져오기 실패:`, error);
        }
    };

    /* 달력의 날짜 클릭 이벤트 핸들러 */
    const onDateClick = (date) => {
        const dateString = moment(date).format('YYYY-MM-DD');
        fetchSchedulesForDate(dateString); // 서버에서 선택된 날짜의 일정 조회
    };

    /* 달력의 타일 콘텐츠 표시 함수 */
    const scheduleTileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = moment(date).format('YYYY-MM-DD');
            const scheduleData = schedules[dateString]; // 해당 날짜의 일정 데이터

            if (scheduleData && Array.isArray(scheduleData)) {
                let topOffset =35;
                return (
                    <div className="schedule-label-container">
                           {scheduleData.map((data, index) => {
                        const labelStyle = {
                            backgroundColor: getLabelColor(data.label),
                            zIndex: 2 + index, // 각 라벨의 z-index를 다르게 설정
                            top: `${topOffset}px`,
                        };
                        topOffset += 17; // 다음 일정의 top 값을 아래로 밀어줌 (라벨 높이에 맞춰 조정)
                        return (
                            <div key={index} className="schedule-label" style={labelStyle}>
                                <span className="schedule-title">{data.title}</span>
                            </div>
                        );
                    })}
                    </div>
                );
            } else if (scheduleData) {
                return (
                    <div className="schedule-label" style={{ backgroundColor: getLabelColor(scheduleData.label) }}>
                        <span className="schedule-title">{scheduleData.title}</span>
                    </div>
                );
            }
        }
        return null;
    };

    // 라벨 색상을 설정하는 함수
    const getLabelColor = (label) => {
        switch (label) {
            case '빨강':
                return '#ff6347';
            case '초록':
                return '#32cd32';
            case '파랑':
                return '#1e90ff';
            default:
                return '#d3d3d3';
        }
    };

    /* 달력의 타일 스타일 지정 함수 */
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const isNeighboringMonth =
                date.getMonth() !== value.getMonth() || date.getFullYear() !== value.getFullYear();

            const isSaturday = date.getDay() === 6;
            const isSunday = date.getDay() === 0;

            if (isNeighboringMonth && isSaturday) return "neighboring-saturday";
            if (isNeighboringMonth && isSunday) return "neighboring-sunday";
            if (!isNeighboringMonth && isSaturday) return "current-saturday";
            if (!isNeighboringMonth && isSunday) return "current-sunday";
        }
        return null;
    };

    useEffect(() => {
        fetchAllSchedules(); // 컴포넌트가 마운트될 때 전체 일정을 가져옵니다.
    }, []);

    return (
        <>
        <div className={styles.backgroundimageSection}>
            <img src="../assets/style/img/G.jpg" alt="눈사람" className={styles.image}></img>
        </div>
            <div className={styles.textSection}>
                <p>안녕</p>
                <p>나는</p>
                <p>눈사람이야</p>
            </div>
        <div className={styles.calendarContainer}>
            <Calendar
                onChange={onChange}
                value={value}
                formatDay={(local, date) => moment(date).format("D")}
                locale="en"
                calendarType="hebrew"
                showNeighboringMonth={true}
                next2Label={null}
                prev2Label={null}
                onClickDay={onDateClick}
                tileContent={scheduleTileContent}
                tileClassName={tileClassName}
            />
        </div>
        </>
    );
};

export default CalendarComponent;
