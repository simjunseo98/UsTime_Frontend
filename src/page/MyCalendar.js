import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 기본 CSS 스타일링 추가

function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  /**
   * 날짜 변경 핸들러 함수.
   * 선택한 날짜로 상태를 업데이트합니다.
   * @param {Date} date - 선택된 날짜 객체
   */
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>React Calendar</h2>
      <Calendar 
        onChange={handleDateChange} 
        value={selectedDate} 
      />
      <p>선택한 날짜: {selectedDate.toDateString()}</p>
    </div>
  );
}
export default MyCalendar;