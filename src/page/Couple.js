import React,{useState,useEffect} from "react";
import styles from "../assets/style/Couple.module.scss";
// import api from "../service/api.js";

const Couple =()=>{
    const [couplePhoto, setCouplePhoto] = useState(null); // 커플 사진 상태
    const [dDay, setDDay] = useState(""); // D-Day 날짜 상태
    const [daysLeft, setDaysLeft] = useState(null); // 계산된 남은 날짜
    const [animate, setAnimate] = useState(false); // 애니메이션 상태
    const maxtoday = new Date().toISOString().split("T")[0];
    const [specialDays, setSpecialDays] = useState([]); // 기념일 목록
    const [inputDays, setInputDays] = useState(""); // 일정 계산기 입력값 상태
    const [calculatedDates, setCalculatedDates] = useState([]); // 계산된 날짜 목록



    // 커플 사진 업로드 핸들러
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setCouplePhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // D-Day 설정 핸들러
    const handleDDaySet = (e) => {
        const selectedDate = e.target.value;
        setDDay(selectedDate);

        // D-Day까지 남은 날짜 계산
        const today = new Date();
        const targetDate = new Date(selectedDate);
        const difference = Math.ceil((today-targetDate) / (1000 * 60 * 60 * 24));
        setDaysLeft(difference);

        // 애니메이션 트리거
        setAnimate(true);
    };
      // 애니메이션 상태 초기화
      useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => setAnimate(false), 1000); // 1초 후 애니메이션 종료
            return () => clearTimeout(timer);
        }
    }, [animate]);

    //D-day를 기준으로 일/년 기념일 계산 메소드
    useEffect(() =>{
       if(dDay){
    
    const targetDate = new Date(dDay);

    const daySpecial =100;
    const yearSpecial =1;
    const maxDay=2000;
    const maxYear=10;
    const weekday =["일","월","화","수","목","금","토"];

    let calculatedDay = [];
 
    // 일 수 기념일 계산
    for(let day = daySpecial; day <=maxDay; day +=daySpecial){
        const milestoneDate =new Date(
            targetDate.getTime() + day * 24 * 60 * 60 * 1000
        );
        const today = new Date();
        const daysLeft =`D-${Math.ceil((milestoneDate - today) / (1000 * 60 * 60 * 24)-1)}`;
        const weekdays = weekday[milestoneDate.getDay()];

        let milestoneString = `${daysLeft}`;

        if(daysLeft<0){
            milestoneString =`--${-daysLeft}`;
        }
        const formmatedMilestoneString = milestoneString.replace('--','+');
        calculatedDay.push({
            milestone: `${day}일`,
            milestoneDate: milestoneDate.toISOString().split("T")[0],
            daysLeft:formmatedMilestoneString,
            weekdays,
        });
    }

     // 년 단위 기념일 계산
     for (let year = yearSpecial; year <= maxYear; year += yearSpecial) {
        const milestoneDate = new Date(targetDate);
        milestoneDate.setFullYear(targetDate.getFullYear() + year);
        const today = new Date();
        const daysLeft =`D-${Math.ceil((milestoneDate - today) / (1000 * 60 * 60 * 24))}`;
        const weekdays = weekday[milestoneDate.getDay()];
        let milestoneString = `${daysLeft}`;
        if(daysLeft<0){
            milestoneString =`--${-daysLeft}`;
        }
        const formmatedMilestoneString = milestoneString.replace('--','+');
        calculatedDay.push({
            milestone: `${year}주년`,
            milestoneDate: milestoneDate.toISOString().split("T")[0],
            daysLeft:formmatedMilestoneString,
            weekdays,
        });
    }
      // 기념일 배열 정렬
      calculatedDay.sort((a, b) => new Date(a.milestoneDate) - new Date(b.milestoneDate));

      setSpecialDays(calculatedDay);
    }
    },[dDay]);

    // 일정 계산기
  const handleDaysInput = (e) => {
    setInputDays(e.target.value);
  };

  const calculateDates = (e) => {
    e.preventDefault();
    const days = parseInt(inputDays);
    if (days && dDay) {
      const today = new Date();
      const newCalculatedDates = [];

      const weekday = ["일", "월", "화", "수", "목", "금", "토"];

      // 날짜 계산
      for (let i = 1; i <= days; i++) {
        const futureDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
        const formattedDate = futureDate.toISOString().split("T")[0];
        const weekdayStr = weekday[futureDate.getDay()];

        // 주말, 평일 여부와 일정 여부 체크
        newCalculatedDates.push({
          date: formattedDate,
          weekday: weekdayStr,
          priority: futureDate.getDay() === 0 || futureDate.getDay() === 6 ? 2 : 1, // 2: 주말, 1: 평일
        });
      }

      setCalculatedDates(newCalculatedDates);
    }
  };
    return(
        <>
    <div className={styles.CoupleContainer}>
                  {/* 커플 배너 */}
                  <div
                    className={styles.CoupleBanner}
                    style={{
                        backgroundImage: couplePhoto ? `url(${couplePhoto})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                      {/* D-Day 설정 */}
                    <label className={styles.DDayInputLabel}>
                    D-Day 설정하기  :  
                        <input
                            type="date"
                            max={maxtoday}
                            value={dDay}
                            onChange={handleDDaySet}
                            className={styles.DDayInput}
                        /></label>
                    <p
                        className={`${styles.DDayText} ${
                            animate ? styles.AnimateText : ""
                        }`}
                    >
                        {daysLeft !== null ? `D-${daysLeft}` : "D-Day를 설정하세요!"}
                    </p>

                    {/* 커플 사진 업로드 */}
                    <label htmlFor="fileInput" className={styles.fileLabel}>
                   배경 선택📷</label>
<input
    type="file"
    id="fileInput"
    className={styles.fileInput}
    accept="image/*"
    onChange={handlePhotoUpload}
/>
                </div>

       <div className={styles.CoupleContent}>
                <div className={styles.CoupleContentContainer}>
                <div className={styles.ScheduleCalculate}>
                     <form onSubmit={calculateDates}>
                            <h2>@ 일정 계산기 (날짜) @</h2>
                            <input type="number"  min="1" max="10000" 
                                   name="" aria-label="일"
                                   step="any"
                                   value={inputDays}
                                   onChange={handleDaysInput}
                                   required />일
                            <button type="submit">계산 하기</button>
                        </form>
                </div>
                <div className={styles.CoupleDdayResult}>
                    <h2>@ 계산된 기념일 @</h2>
                    {calculatedDates.length > 0 ? (
                <ul>
                  {calculatedDates.slice(0, 3).map((item, index) => {
                    const priorityText =
                      item.priority === 1
                        ? "1순위: 평일 일정 없음"
                        : "2순위: 주말 일정 없음";
                    return (
                      <li key={index}>
                        {item.date} ({item.weekday}) - {priorityText}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>계산된 일정이 없습니다. 날짜를 입력해주세요.</p>
              )}
                    </div>
                    <div className={styles.CoupleDdayCalculate}>
                <h3>@ 다가오는 기념일 @</h3>
                    {specialDays.length > 0 ? (
                       <ul>
                       {specialDays.map((day, index) => {
                           const isWeekend = day.weekdays === "토" || day.weekdays === "일";

                     // 기념일이 지나갔는지 확인
                           const today = new Date();
                           const milestoneDate = new Date(day.milestoneDate);
                           const isPast = milestoneDate < today;

                     // 조건부 클래스 설정
                           const listItemClass = `${isWeekend ? styles.weekend : styles.weekday} ${
                                                   isPast ? styles.past : styles.upcoming
            }`;

                           return (
                               <li
                                   key={index}
                                   className={listItemClass}
                               >
                                   {day.milestone}: {day.milestoneDate} ({day.weekdays}요일) (
                                   {day.daysLeft}일)
                               </li>
                           );
                       })}
                   </ul>
                    ) : (
                        <p>D-Day를 설정하면 기념일이 표시됩니다!</p>
                    )}
                </div>
                </div>
                <div className={styles.CoupleContentContainer2}>
                         나야 컨텐츠 2
                </div>
       </div>
    </div>
        </>
    )
}

export default Couple;