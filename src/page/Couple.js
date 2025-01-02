import React, { useState, useEffect, useCallback} from "react"; // useCallback 추가
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

  //초기화시 한 번만 호출되게 가독성 개선
  const [userId] = useState(() => sessionStorage.getItem("userId"));
  const [coupleId] = useState(() => sessionStorage.getItem("coupleId"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  //체크리스트 데이터 관리
  const [data, setData] = useState({
    장소: [],
    음식: [],
    영화: [],
    데이트:[],
  });

  const categories = [
    { title: "장소", key: "장소" },
    { title: "음식", key: "음식" },
    { title: "영화", key: "영화" },
    { title: "데이트", key: "데이트" },
  ];

  //체크리스트 모달
  const openModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };


   //체크리스트 추가 핸들러
   const handleAddItem = async (category, newItem) => {
      // 유효성 검사: newItem이 비었는지 확인
  if (!newItem || !newItem.trim()) {
    alert("항목 이름을 입력하세요.");
    return;
  }

    // 유효성 검사: 유효한 카테고리인지 확인
    const validCategories = ["장소", "음식", "영화", "데이트"];
    if (!validCategories.includes(category)) {
      alert("유효하지 않은 카테고리입니다.");
      return;
    }
    // 중복 항목 방지
  const isDuplicate = data[category]?.some(
    (item) => item.title.trim().toLowerCase() === newItem.trim().toLowerCase());
  if (isDuplicate) {
    alert("이미 존재하는 항목입니다.");
    return;
  }

    if (!userId || !coupleId) {
      alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
      return;
    }
    try {
      // 서버에 새 항목 저장
      const response = await api.post("/check/add", null, {
        params: {
          userId,
          coupleId,
          category,
          title: newItem,
        },
     });
     

      if (response.status >=200 && response.status < 300 ) {
        // 로컬 상태 업데이트
        setData((prev) => ({
          ...prev,
          [category]: [...prev[category], response.data[0].title],
        }));
        alert("항목이 성공적으로 저장되었습니다!");
      }
    } catch (error) {
      console.error("항목 추가 실패:", error.response|| error
      );
      alert("항목 추가 중 오류가 발생했습니다.");
    }
  };

  //체크 리스트 불러오기
  useEffect(() => {
    if (!coupleId) {
      console.error("유효하지 않은 coupleId:", coupleId);
      return;
    }
  
    const fetchChecklist = async () => {
      try {
        const response = await api.get(`/check/${coupleId}`);
        const checklistData = response.data;
  
        if (checklistData) {
          // 받은 데이터가 유효한 경우
          setData({
            장소: checklistData.filter(item => item.category === "장소").map(item => item.title),
            음식: checklistData.filter(item => item.category === "음식").map(item => item.title),
            영화: checklistData.filter(item => item.category === "영화").map(item => item.title),
            데이트: checklistData.filter(item => item.category === "데이트").map(item => item.title),
          });
          console.log("ddd",checklistData);
        } else {
          console.log("서버에 데이터 없음");
        }
      } catch (error) {
        console.error("체크리스트 데이터를 가져오는 데 실패했습니다:", error);
      }
    };
  
    fetchChecklist();
  }, [coupleId]);
  

  // const handleDeleteItem = async (checklistId,category) => {
  //   console.log("삭제할 checklistId:", checklistId); // checklistId 값 확인
  //   try {
  //     // 서버에서 항목 삭제
  //     const response = await api.delete(`/check/delete?checklistId=${checklistId}`);
      
  //     if (response.status === 200) {
  //       // 로컬 상태에서 항목 삭제
  //       setData((prev) => ({
  //         ...prev,
  //         [category]: prev[category].filter((item) => item.checklistId !== checklistId),
  //       }));
  //       alert("항목이 삭제되었습니다!");
  //     }
  //   } catch (error) {
  //     console.error("항목 삭제 실패:", error.response || error);

  //     alert("항목 삭제 중 오류가 발생했습니다.");
      
  //   }
  // };
//----------------------------------------------------------------------------------------------
// 커플 베너
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
      console.log("응답",response);
      alert("기념일 수정이 완료되었습니다.");

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
  {categories.map(({ title, key }) => {
     return(
        <CheckListCategory
          key={key}
          title={title}
          items={data[key] || []}
          onAddItem={() => openModal(key)}
        />
      );
})}
</div>
      </div>
      {/* 모달 표시 */}
      <CheckListModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedCategory={selectedCategory}
        data={data}
        handleAddItem={handleAddItem}
      />

          <div className={styles.Couple3}>
            오늘의 운세
          </div>
    </div>
    </div>
      </div>
  );
};

export default Couple;
