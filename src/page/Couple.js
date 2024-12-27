import React, { useState, useEffect, useCallback } from "react"; // useCallback 추가
import styles from "../assets/style/Couple.module.scss";
import api from "../service/api.js";
import CheckListCategory from "../Component/CheckListCategory.js";
import CheckListModal from "../Component/CheckListModal.js";

const Couple = () => {
  const [couplePhoto, setCouplePhoto] = useState(null);
  const [dDay, setDDay] = useState("");
  const [daysPassed, setDaysPassed] = useState(null);
  const [specialDays, setSpecialDays] = useState([]);
  const [inputDays, setInputDays] = useState("");
  const [calculatedDates, setCalculatedDates] = useState([]);

  const maxtoday = new Date().toISOString().split("T")[0];
  const coupleId = sessionStorage.getItem("coupleId");
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  //체크리스트 데이터 관리
  const [data, setData] = useState({
    placesToVisit: [],
    foodList: [],
    moviesToWatch: [],
    dateIdeas: []
  });
  //체크리스트 모달
  const openModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };
   //체크리스트
   const handleAddItem = (category, newItem) => {
    setData(prev => ({
      ...prev,
      [category]: [...prev[category], newItem]
    }));
  };
  // 커플 사진 업로드 핸들러
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCouplePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // D-Day 설정 및 API 호출 핸들러
  const handleDDaySet = async () => {
    if (!dDay) return alert("D-Day를 선택해주세요!");

    try {
      const today = new Date();
      const targetDate = new Date(dDay);
      const difference = Math.ceil((today - targetDate) / (1000 * 60 * 60 * 24));
      setDaysPassed(difference);

      const response = await api.post(`/couple/update?coupleId=${coupleId}&date=${dDay}`);
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
  const fetchAnniversary = useCallback(async () => {
    try {
      const response = await api.get(`/couple/getInfo?coupleId=${coupleId}`);
      const coupleInfo = response.data;

      if (coupleInfo && coupleInfo.anniversary) {
        const anniversaryDate = new Date(coupleInfo.anniversary);
        setDDay(anniversaryDate.toISOString().split('T')[0]);

        const futureAnniversaries = [];
        for (let i = 1; i <= 5; i++) {
          const futureDate = new Date(anniversaryDate);
          futureDate.setDate(anniversaryDate.getDate() + i * 100);

          const weekday = futureDate.toLocaleDateString('ko-KR', { weekday: 'long' });
          const differenceInDays = Math.floor((futureDate - new Date()) / (1000 * 60 * 60 * 24));

            // D- 또는 D+ 포맷 결정
           const daysLeft =
           differenceInDays >= 0
            ? `D-${differenceInDays}`
            : `D+${Math.abs(differenceInDays)}`; // 과거 날짜는 D+로 표시

          futureAnniversaries.push({
            milestone: `${i * 100}일 기념일`,
            milestoneDate: futureDate.toISOString().split('T')[0],
            weekdays: weekday,
            daysLeft: daysLeft,
          });
        }

        setSpecialDays(futureAnniversaries);
      } else {
        console.error("anniversary 데이터가 없습니다.");
        setSpecialDays([]);
      }
    } catch (error) {
      console.error("기념일 정보를 가져오는 데 실패했습니다.", error);
      setSpecialDays([]);
    }
  }, [coupleId]); // coupleId 변경 시에만 실행되도록 의존성 설정

  // D-Day 변경시, 지난 날짜를 계산하여 상태 업데이트
  useEffect(() => {
    if (dDay) {
      const today = new Date();
      const targetDate = new Date(dDay);
      const difference = Math.ceil((today - targetDate) / (1000 * 60 * 60 * 24));
      setDaysPassed(difference);
    }
  }, [dDay]);

  // 컴포넌트 마운트 시, D-Day와 기념일 목록을 가져옴
  useEffect(() => {
    if (coupleId) {
      fetchAnniversary();
    }
  }, [coupleId, fetchAnniversary]); // fetchAnniversary가 변경될 때마다 호출

  const handleDaysInput = (e) => setInputDays(e.target.value);

  const calculateDates = async (e) => {
    e.preventDefault();
    const days = parseInt(inputDays);
    if (days && dDay) {
      try {
        const response = await api.post("/couple/calculateSpecialDays", { coupleId, days, dDay });
        setCalculatedDates(response.data);
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
                  const isWeekend = day.weekdays === "토요일" || day.weekdays === "일요일";
                  const today = new Date();
                  const milestoneDate = new Date(day.milestoneDate);
                  const isPast = milestoneDate < today;

                  const listItemClass = ` ${isPast ? styles.past : styles.upcoming}`;

                  return (
                    <li key={index} className={listItemClass} style={isWeekend ? {color: "red"}:{}}>
                      {day.milestone}: {day.milestoneDate} ({day.weekdays}) ({day.daysLeft}일)
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
      <div className={styles.CoupleCheckList}>
        <h3>@@ 체크리스트 @@</h3>
        <div className={styles.BukitList}>
          <CheckListCategory
            title="가보고 싶은 곳"
            items={data.placesToVisit}
            onAddItem={() => openModal("placesToVisit")}
            
          />
          <CheckListCategory
            title="먹킷 리스트"
            items={data.foodList}
            onAddItem={() => openModal("foodList")}
          />
          <CheckListCategory
            title="무킷 리스트"
            items={data.moviesToWatch}
            onAddItem={() => openModal("moviesToWatch")}
          />
          <CheckListCategory
            title="데이트 리스트"
            items={data.dateIdeas}
            onAddItem={() => openModal("dateIdeas")}
          />
        </div>
      </div>
      {/* 모달 표시 */}
      <CheckListModal isOpen={isModalOpen} onClose={closeModal}>
        <CheckListCategory
          title={selectedCategory}
          items={data[selectedCategory]}
          onAddItem={() => {
            const newItem = prompt("추가할 항목을 입력하세요:");
            if (newItem && newItem.trim() !== "") {
              handleAddItem(selectedCategory, newItem);
            }
          }}
        />
      </CheckListModal>
          <div className={styles.Couple3}>
            오늘의 운세
          </div>
    </div>
    </div>
      </div>
  );
};

export default Couple;
