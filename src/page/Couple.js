import React, { useState, useEffect } from "react";
import styles from "../assets/style/Couple.module.scss";
import api from "../service/api.js";

const Couple = () => {
  const [couplePhoto, setCouplePhoto] = useState(null); // 커플 사진 상태
  const [dDay, setDDay] = useState(""); // D-Day 날짜 상태
  const [daysPassed, setDaysPassed] = useState(null); // 지난 날짜
  const [specialDays, setSpecialDays] = useState([]); // 기념일 목록
  const [inputDays, setInputDays] = useState(""); // 일정 계산기 입력값 상태
  const [calculatedDates, setCalculatedDates] = useState([]); // 계산된 날짜 목록

  const maxtoday = new Date().toISOString().split("T")[0]; // 오늘 날짜
  const coupleId = sessionStorage.getItem("coupleId"); // 세션에서 커플 ID 가져오기

  // 커플 사진 업로드 핸들러
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCouplePhoto(reader.result); // 사진 미리보기 설정
      reader.readAsDataURL(file);
    }
  };

  // D-Day 설정 및 API 호출 핸들러
  const handleDDaySet = async () => {
    if (!dDay) return alert("D-Day를 선택해주세요!"); // D-Day가 설정되지 않으면 경고

    try {
      const today = new Date();
      const targetDate = new Date(dDay);
      const difference = Math.ceil((today - targetDate) / (1000 * 60 * 60 * 24)); // D-Day와 오늘의 차이 계산
      setDaysPassed(difference); // 지난 날짜 설정

      const response = await api.post(`/couple/update?coupleId=${coupleId}&date=${dDay}`); // D-Day 업데이트 API 호출
      alert("기념일 수정이 완료되었습니다.");
      console.log("기념일 업데이트 성공:", response.data);

      // D-Day 설정 후 기념일 목록을 갱신하는 API 호출
      fetchAnniversary(); // 기념일 목록 갱신
    } catch (error) {
      console.error("기념일 업데이트 실패:", error);
      alert("기념일 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 기념일 정보 가져오기
  const fetchAnniversary = async () => {
    try {
      const response = await api.get(`/couple/getInfo?coupleId=${coupleId}`);
      const coupleInfo = response.data;

      if (coupleInfo && coupleInfo.anniversary) {
        const anniversaryDate = new Date(coupleInfo.anniversary); // 사귄날 기준
        setDDay(anniversaryDate.toISOString().split('T')[0]); // D-Day 설정

        // 100일, 200일, 300일, 400일, 500일 기념일 계산
        const futureAnniversaries = [];
        for (let i = 1; i <= 5; i++) {
          const futureDate = new Date(anniversaryDate);
          futureDate.setDate(anniversaryDate.getDate() + i * 100); // 100일 단위로 계산

          const weekday = futureDate.toLocaleDateString('ko-KR', { weekday: 'long' });

          futureAnniversaries.push({
            milestone: `${i * 100}일 기념일`,
            milestoneDate: futureDate.toISOString().split('T')[0], // 날짜만 가져오기
            weekdays: weekday,
            daysLeft: Math.floor((futureDate - new Date()) / (1000 * 60 * 60 * 24)), 
          });
        }

        setSpecialDays(futureAnniversaries); // 계산된 기념일 리스트 설정
      } else {
        console.error("anniversary 데이터가 없습니다.");
        setSpecialDays([]); // anniversary 데이터가 없으면 빈 배열로 설정
      }
    } catch (error) {
      console.error("기념일 정보를 가져오는 데 실패했습니다.", error);
      setSpecialDays([]); // 오류 발생 시 빈 배열 설정
    }
  };

  // D-Day 변경시, 지난 날짜를 계산하여 상태 업데이트
  useEffect(() => {
    if (dDay) {
      const today = new Date();
      const targetDate = new Date(dDay);
      const difference = Math.ceil((today - targetDate) / (1000 * 60 * 60 * 24));
      setDaysPassed(difference); // 지난 날짜 설정
    }
  }, [dDay]);

  // 컴포넌트 마운트 시, D-Day와 기념일 목록을 가져옴
  useEffect(() => {
    if (coupleId) {
      fetchAnniversary(); // D-Day 및 기념일 정보 불러오기
    }
  }, [coupleId]);

  // 일정 계산기 입력값 핸들러
  const handleDaysInput = (e) => setInputDays(e.target.value);

  // 일정 계산기 처리
  const calculateDates = async (e) => {
    e.preventDefault(); // 폼 기본 동작 방지
    const days = parseInt(inputDays); // 입력값을 정수로 변환
    if (days && dDay) {
      try {
        const response = await api.post("/couple/calculateSpecialDays", { coupleId, days, dDay });
        setCalculatedDates(response.data); // 계산된 날짜 목록 받기
      } catch (error) {
        console.error("기념일 계산 실패:", error);
        alert("기념일 계산 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className={styles.CoupleContainer}>
      <div
        className={styles.CoupleBanner}
        style={{
          backgroundImage: couplePhoto ? `url(${couplePhoto})` : "none", // 커플 사진 배경 설정
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
<div className={styles.DDayInputWrapper}>
  <label className={styles.DDayInputLabel}>
    D-Day 설정하기 :
    <input
      type="date"
      max={maxtoday}
      value={dDay}
      onChange={(e) => setDDay(e.target.value)} // D-Day 날짜 변경시 상태 업데이트
      className={styles.DDayInput}
    />
  </label>
  <button onClick={handleDDaySet} className={styles.DDayButton}>설정</button>
</div>
<p className={`${styles.DDayText}`}>
  {daysPassed !== null ? `D+${daysPassed}일` : "D-Day를 설정하세요!"}
</p>


        <label htmlFor="fileInput" className={styles.fileLabel}>배경 선택📷</label>
        <input
          type="file"
          id="fileInput"
          className={styles.fileInput}
          accept="image/*"
          onChange={handlePhotoUpload} // 사진 업로드 시 미리보기 설정
        />
      </div>

      <div className={styles.CoupleContent}>
        <div className={styles.CoupleContentContainer}>
          <div className={styles.ScheduleCalculate}>
            <form onSubmit={calculateDates}>
              <h2>@ 일정 계산기 (날짜) @</h2>
              <input
                type="number"
                min="1"
                max="10000"
                value={inputDays}
                onChange={handleDaysInput} // 일정 계산기 입력값 처리
                required
              />
              일
              <button type="submit">계산 하기</button>
            </form>
          </div>

          <div className={styles.CoupleDdayResult}>
            <h2>@ 계산된 기념일 @</h2>
            {calculatedDates.length > 0 ? (
              <ul>
                {calculatedDates.slice(0, 3).map((item, index) => (
                  <li key={index}>
                    {item.date} ({item.weekday}) - {item.priority === 1 ? "1순위: 평일 일정 없음" : "2순위: 주말 일정 없음"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>계산된 일정이 없습니다. 날짜를 입력해주세요.</p>
            )}
          </div>

          <div className={styles.CoupleDdayCalculate}>
            <h3>@ 다가오는 기념일 @</h3>
            {Array.isArray(specialDays) && specialDays.length > 0 ? (  // 배열 확인
              <ul>
                {specialDays.map((day, index) => {
                  const isWeekend = day.weekdays === "토" || day.weekdays === "일";
                  const today = new Date();
                  const milestoneDate = new Date(day.milestoneDate);
                  const isPast = milestoneDate < today;

                  const listItemClass = `${isWeekend ? styles.weekend : styles.weekday} ${isPast ? styles.past : styles.upcoming}`;

                  return (
                    <li key={index} className={listItemClass}>
                      {day.milestone}: {day.milestoneDate} ({day.weekdays}) (D-{day.daysLeft})
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>D-Day를 설정하면 기념일이 표시됩니다!</p>
            )}
          </div>
        </div>
        <div className={styles.CoupleContentContainer2}>나야 컨텐츠 2</div>
      </div>
    </div>
  );
};

export default Couple;
