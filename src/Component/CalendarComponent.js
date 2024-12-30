import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import moment from 'moment';
import styles from '../assets/style/Main.module.scss';
import api from "../service/api";
import CalendarDetail from "./CalendarDetail";

const CalendarComponent = (props) => {
    console.log(props);

    const userId = sessionStorage.getItem("userId"); 
    const isCoupleId = sessionStorage.getItem("coupleId");
    const coupleId = isCoupleId === null || isCoupleId === undefined ? null : isCoupleId;


    const [value, onChange] = useState(new Date()); // 달력의 현재 날짜 상태
    const [schedules, setSchedules] = useState({}); // 전체 일정을 저장하는 객체
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜의 일정
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false); // 사이드 패널 열림 상태
    const [scheduleScope, setScheduleScope] = useState("전체"); // 일정 범위 (개인, 공유, 전체)

    useEffect(() => {
        const fetchAllSchedules = async () => {
            try {
                const params = {
                    userId,
                    scope: scheduleScope,
                };
    
                if (!coupleId) {
                    params.coupleId = coupleId;
                }
                const response = await api.get('/calendar/all', { params });
    
                const scheduleData = response.data.reduce((acc, curr) => {
                    const startDate = moment(curr.startDate);
                    const endDate = moment(curr.endDate);
                    let currentDate = startDate.clone();
    
                    // startDate부터 endDate까지 반복하면서 일정 추가
                    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
                        const dateString = currentDate.format('YYYY-MM-DD');
                        if (!acc[dateString]) {
                            acc[dateString] = [];
                        }
                        acc[dateString].push({
                            scheduleId: curr.scheduleId,
                            title: curr.title,
                            description: curr.description,
                            startDate: curr.startDate,
                            endDate: curr.endDate,
                            label: curr.label,
                            location: curr.location,
                            scope: curr.scope,
                            createdAt: curr.createdAt,
                        });
                        currentDate.add(1, 'days'); 
                    }
    
                    return acc;
                }, {});
    
                setSchedules(scheduleData);
            } catch (error) {
                console.error("전체 일정 가져오기 실패:", error);
            }
        };
    
        fetchAllSchedules();
    }, [userId, coupleId, scheduleScope]); // `scheduleScope`가 변경될 때마다 재요청

    const fetchSchedulesForDate = (date) => {
        const dateString = moment(date).format('YYYY-MM-DD');
        const dateSchedules = schedules[dateString] || []; // 해당 날짜의 일정 가져오기
        setSelectedDate({
            date,
            details: dateSchedules,
        });
        setIsSidePanelOpen(true);
    };

    // 범위가 변경될 때 사이드 패널을 닫음
    useEffect(() => {
        setIsSidePanelOpen(false);
    }, [scheduleScope]);

    const onDateClick = (date) => {
        fetchSchedulesForDate(date); // 클릭된 날짜의 일정 처리
    };

const scheduleTileContent = ({ date, view }) => {
    if (view === 'month') {
        const dateString = moment(date).format('YYYY-MM-DD');
        const scheduleData = schedules[dateString];

        if (scheduleData && Array.isArray(scheduleData)) {
            let topOffset = 35;
            return (
                <div className="schedule-label-container">
                    {scheduleData.map((data, index) => {
                        const startDate = moment(data.startDate);
                        const endDate = moment(data.endDate);
                        let labelStyle = {
                            backgroundColor: getLabelColor(data.label),
                            zIndex: 2 + index,
                            top: `${topOffset}px`,
                        };

                        // 라벨을 시작일부터 종료일까지 연결
                        if (startDate.isBefore(date) && endDate.isAfter(date)) {
                            labelStyle.position = 'absolute';
                            labelStyle.left = '0px';
                            labelStyle.right = '0px';
                        }

                        topOffset += 17;

                        return (
                            <div key={index} className="schedule-label" style={labelStyle}>
                                <span className="schedule-title">{data.title}</span>
                            </div>
                        );
                    })}
                </div>
            );
        }
    }
    return null;
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

    return (
        <>
            <div className={styles.calendarWrapper}>
                {/* 일정 범위 선택 콤보박스 */}

                <div className={styles.calendarContainer}>
                <div className={styles.scopeSelector}>
                    <label htmlFor="scope">일정 표시:</label>
                    <select
                        id="scope"
                        value={scheduleScope}
                        onChange={(e) => setScheduleScope(e.target.value)}
                    >
                        <option value="개인">개인</option>
                        <option value="공유">공유</option>
                        {/* {coupleId && <option value="공유">공유</option>} */}
                        {coupleId && <option value="전체">전체</option>}
                    </select>
                </div>
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
                {isSidePanelOpen && (
                    <CalendarDetail
                        selectedDate={selectedDate}
                        onClose={() => setIsSidePanelOpen(false)}
                    />
                )}
            </div>
        </>
    );
};

export default CalendarComponent;
