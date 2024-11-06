import { useState } from "react";
import React from "react";
import Calendar from 'react-calendar';
//자바스크립트에서 날짜 데이터 조작하기 쉽게 해주는 라이브러리
import moment from 'moment';
import styles from '../assets/style/Main.module.scss';
// import 'react-calendar/dist/Calendar.css'; // 기본 CSS 스타일링 추가
import '../assets/style/MyCalendar.css';


const Main = () =>{
    const [value, onChange] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    //특정 날짜에 표시할 임시 데이터
    const schedule = {
        '2024-11-14':'내 생일',
        '2024-11-16':'글램핑',
        '2024-11-05':'월급날',
    };

    //tileContent 함수 정의
    const scheduleTileContent = ({date, view}) =>{
      //일정 컨텐츠 표시
      if(view == 'month'){
        //moment 라이브러리르 사용해 date 객체를 날짜 형식 문자열로 변환 
        const dateString = moment(date).format('YYYY.MM.DD.')
        return schedule[dateString] ? (
            <p style={{color :'wheat' , fontSize:'10px'}}>{schedule[dateString]}</p>
        ) :  null;
    }
};
//추후 사용 예정 일정 컨텐츠 관리
 // tileContent={({ date, view }) => { 
 //    const formattedDate = moment(date).format('YYYY. MM. DD.')
 //    if (createdList.find((x)=> x === moment(date).format('YYYY. MM. DD.'))) ;
 //    }}
   // 날짜 클릭 시 패널을 여는 함수
  const onDateClick = (date) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    if (schedule[dateString]) {
      setSelectedDate({ date: dateString, schedule: schedule[dateString] });
      setIsPanelOpen(true); // 패널 열기
    }
  };
   // 패널 닫기 함수
   const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedDate(null);
  };
    /**
         * 날짜 변경 핸들러 함수.
         * 선택한 날짜로 상태를 업데이트합니다.
         * @param {Date} date - 선택된 날짜 객체
    */
    const handleDateChange = (date) => {
        onChange(date);
    }
   
    
    return(
<div children>
    <div className={styles.container}>
<div className={`${styles.calendarContainer} no-underline`}>
      <h2>Calendar</h2>
      <Calendar 
        onChange={handleDateChange} 
        value={value}
        formatDay={(local,date) => moment(date).format("D")} // 달력에 표시되는 일 자 숫자로만 나오게 표현
        locale="en" //영어 표기
        calendarType="hebrew"
        showNeighboringMonth={true} //  이전, 이후 달의 날짜는 보이지 않도록 설정  
        next2Label={null} // 년 단위 넘기는 버튼 제거
        prev2Label={null}  // ""   
        onClickDay={onDateClick} // 날짜 클릭 이벤트 추가 
        tileContent={scheduleTileContent}  
        // selectRange={true} 선택한 날짜 기간 표시   
            />
    </div>
      {isPanelOpen && (
        <div className={styles.sidepanel}>
          <h3>일정 세부 정보</h3>
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
    </div>
    );
}
export default Main;