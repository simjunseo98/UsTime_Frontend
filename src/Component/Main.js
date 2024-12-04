import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import moment from 'moment';
// import backImage from '../assets/img/G.jpg';
import styles from '../assets/style/Main.module.scss';
import '../assets/style/MyCalendar.css';
import api from "../service/api";

const Main = () => {
    const [value, onChange] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [schedule, setSchedule] = useState({});
    const [newSchedule, setNewSchedule] = useState(""); // 추가할 일정 입력 값

    // 서버에서 특정 날짜의 일정을 가져오는 함수
    const fetchSchedulesForDate = async () => {
        const coupleId = sessionStorage.getItem('coupleId');
    
        if (!coupleId) {
            console.error("Couple ID가 없습니다.");
            return;
        }
        try {
            const response = await api.get('/calendar/all');
            console.log(response.data);
            const schedules = response.data.reduce((acc, curr) => {
                acc[curr.date] = curr.schedule;
                return acc;
            }, {});
            setSchedule(schedules);
        } catch (error) {
            console.error("일정 가져오기 실패:", error);
        }
    };
    
    // 일정 추가 요청
// const addSchedule = async () => {
//     if (selectedDate && newSchedule.trim() !== "") {
//         try {
//             const response = await axios.post(`/calendar`, {
//                 date: selectedDate.date,
//                 schedule: newSchedule,
//             });
//             alert("일정이 추가되었습니다!");
//             setNewSchedule(""); // 입력 필드 초기화
//             fetchSchedulesForDate(value); // 새 일정 가져오기
//         } catch (error) {
//             console.error("일정 추가 실패:", error);
//             alert("일정 추가 중 오류가 발생했습니다.");
//         }
//     }
// };
// 일정 삭제 요청
// const deleteSchedule = async () => {
//     if (selectedDate) {
//         try {
//             await axios.delete(`/calendar/${selectedDate.date}`);
//             alert("일정이 삭제되었습니다!");
//             setSelectedDate(null); // 패널 초기화
//             setIsPanelOpen(false);
//             fetchSchedulesForDate(value); // 새 일정 가져오기
//         } catch (error) {
//             console.error("일정 삭제 실패:", error);
//             alert("일정 삭제 중 오류가 발생했습니다.");
//         }
//     }
// };

    //전체 스케줄을 타일로 나타내는 함수
    const scheduleTileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = moment(date).format('YYYY-MM-DD');
            return schedule[dateString] ? (
                <div className="schedule-label">
                {schedule[dateString]}
            </div>
            ) : null;
        }
    };

  // 날짜를 클릭하면 selectedDate만 업데이트
const onDateClick = (date) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    setSelectedDate({
        date: dateString,
        schedule: schedule[dateString] || null, // 일정이 없으면 null로 설정
    });
};

    // // 패널 닫기 함수
    // const closePanel = () => {
    //     setIsPanelOpen(false);
    //     setSelectedDate(null);
    // };

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
            {/* <div className={styles.backgroundimageSection}>
                <img src={backImage} alt="사진" className={styles.backgroundimage}>
                </img>
                <p>안ㄴ뇽</p>
                </div> */}
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
        
    <div className={styles.sidepanel}>
        <div className={styles.scheduleHeader}>
        <h3>Schedule</h3>
        {/* <button onClick={addSchedule} className="add-button">추가</button> */}
        {/* {selectedDate.schedule && (
            <button onClick={deleteSchedule} className="delete-button">삭제</button>
        )} */}
       </div>
        {selectedDate ? (
            <div>
                <p><strong>날짜:</strong> {selectedDate.date}</p>
                <p><strong>일정:</strong> {selectedDate.schedule || "없음"}</p>
                <input
                    className={styles.scheduleInput}
                    type="text"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    placeholder="새 일정 추가"
                />
            </div>
        ) : (
            <div className={styles.coment}>
                <p>날짜를 선택하거나 새로운 일정을 추가하세요!</p>
            </div>
        )}
    </div>


        </div>

    );
};

export default Main;
