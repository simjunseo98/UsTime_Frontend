import React, { useState, useEffect, useCallback} from "react";
import styles from "../assets/style/Couple/Couple.module.scss";
import api from "../service/api.js";

//컴포넌트
import CheckListCategory from "../Component/Couple/CheckListCategory.js";
import CheckListModal from "../Component/Couple/CheckListModal.js";
import CoupleBanner from "../Component/Couple/CoupleBannner.js";
import CoupleDdayList from "../Component/Couple/CoupleDdayList.js";
import CoupleSchedule from "../Component/Couple/CoupleSchedule.js";
import { Link } from "react-router-dom";

const Couple = () => {
  const [dDay, setDDay] = useState("");
  const [daysPassed, setDaysPassed] = useState(null);
  const [specialDays, setSpecialDays] = useState([]);
  const maxtoday = new Date().toISOString().split("T")[0];

  //초기화시 한 번만 호출되게 가독성 개선
  const [userId] = useState(() => sessionStorage.getItem("userId"));
  const [coupleId] = useState(() => sessionStorage.getItem("coupleId"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  //체크리스트 데이터 관리
  const [장소, set장소] = useState([]);
  const [음식, set음식] = useState([]);
  const [영화, set영화] = useState([]);
  const [데이트, set데이트] = useState([]);

// 카테고리 정보
  const categories = [
    { title: "가보고 싶은 곳", key: "장소" },
    { title: "먹킷 리스트", key: "음식" },
    { title: "인생 영화", key: "영화" },
    { title: "데이트 체크", key: "데이트" },
  ];



//체크 리스트 메소드
//----------------------------------------------------------------------------------
  //체크리스트 모달
  const openModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };


  // 공통 상태 업데이트 함수
const updateCategoryState = (category, newItem) => {
  const newStateItem = { 
    checklistId: newItem.checklistId, 
    ishecked: newItem.isChecked, 
    title: newItem.title };

  switch (category) {
    case "장소":
      set장소((prev) => [...prev, newStateItem]);
      break;
    case "음식":
      set음식((prev) => [...prev, newStateItem]);
      break;
    case "영화":
      set영화((prev) => [...prev, newStateItem]);
      break;
    case "데이트":
      set데이트((prev) => [...prev, newStateItem]);
      break;
    default:
      console.warn("알 수 없는 카테고리:", category);
      break;
  }
};

// 체크리스트 추가 핸들러
const handleAddItem = async (category, newItem) => {
  if (!newItem || !newItem.trim()) {
    alert("항목 이름을 입력하세요.");
    return;
  }

  try {
    const response = await api.post("/check/add", null, {
      params: { userId, coupleId, category, title: newItem },
    });

    if (response.status >= 200 && response.status < 300) {
      const addedItem = response.data[0];
       // isChecked 값이 없을 경우 false로 기본값 설정
       updateCategoryState(category, { ...addedItem, isChecked: addedItem.isChecked ?? false });
     // 각 카테고리별로 추가된 항목 상태 업데이트
     switch (category) {
      case "장소":
        set장소((prev) => [...prev, response.data[0].title]);
        break;
      case "음식":
        set음식((prev) => [...prev, response.data[0].title]);
        break;
      case "영화":
        set영화((prev) => [...prev, response.data[0].title]);
        break;
      case "데이트":
        set데이트((prev) => [...prev, response.data[0].title]);
        break;
      default:
        break;
    }
  }
  } catch (error) {
    console.error("항목 추가 실패:", error.response || error);
    alert("항목 추가 중 오류가 발생했습니다.");
  }
};

// 체크리스트 불러오기
useEffect(() => {
  if (!coupleId) {
    console.error("유효하지 않은 coupleId:", coupleId);
    return;
  }

  const fetchChecklist = async () => {
    try {
      const response = await api.get(`/check/${coupleId}`);
      const checklistData = response.data;
      console.log("데이터",checklistData);
      if (checklistData) {
        const initializeChecklist = (category) =>
          checklistData
            .filter((item) => item.category === category)
            .map((item) => ({
              checklistId: item.checklistId,
              isChecked: item.isChecked,
              title: item.title,
            }));

        set장소(initializeChecklist("장소"));
        set음식(initializeChecklist("음식"));
        set영화(initializeChecklist("영화"));
        set데이트(initializeChecklist("데이트"));
      } else {
        console.log("서버에 데이터 없음");
      }
    } catch (error) {
      console.error("체크리스트 데이터를 가져오는 데 실패했습니다:", error);
    }
  };

  fetchChecklist();
}, [coupleId]);

// 체크리스트 항목 삭제 핸들러
const handleDeleteItem = async (checklistId, category) => {
  try {
    // 서버에서 항목 삭제
    const response = await api.delete(`/check/delete/${checklistId}`);

    if (response.status === 200) {
      // 로컬 상태에서 해당 항목 삭제
      switch (category) {
        case "장소":
          set장소((prev) => prev.filter((item) => item.checklistId !== checklistId));
          break;
        case "음식":
          set음식((prev) => prev.filter((item) => item.checklistId !== checklistId));
          break;
        case "영화":
          set영화((prev) => prev.filter((item) => item.checklistId !== checklistId));
          break;
        case "데이트":
          set데이트((prev) => prev.filter((item) => item.checklistId !== checklistId));
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.error("항목 삭제 실패:", error.response || error);
    alert("항목 삭제 중 오류가 발생했습니다.");
  }
};

//----------------------------------------------------------------------------------------------
// 커플 베너
  // 커플 사진 업로드 핸들러
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
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



  return (
<div className={styles.CoupleContainer}>  
<div className={styles.CoupleContentContainer}>
<div className={styles.Banner}>
       <CoupleBanner
        dDay={dDay}
        daysPassed={daysPassed}
        handlePhotoUpload={handlePhotoUpload}
        handleDDaySet={handleDDaySet}
        maxtoday={maxtoday}
        setDDay={setDDay}
      />
</div>
<div className={styles.ContentContainer}>
<div className={styles.leftContainer}>
  <div className={styles.CoupleNavigate}>
           바로 가기:
      <Link to="/main" className={styles.navigateItem}>
        달력
      </Link>
      <Link to="/myprofile" className={styles.navigateItem}>
        프로필
      </Link>
      <Link to="/main" className={styles.navigateItem}>
        보러가기
      </Link>
    </div>
          <CoupleSchedule userId={userId} coupleId = {coupleId} />
          <CoupleDdayList specialDays={specialDays} />
    </div>
    <div className={styles.rightContainer}>
      <div className={styles.CoupleCheckList}>
        <h3>체크리스트</h3>
  <div className={styles.BukitList}> 
  {categories.map(({ title, key }) => {
     return(
        <CheckListCategory
          key={key}
          title={title}
          items={key === "장소" ? 장소 : key === "음식" ? 음식 : key === "영화" ? 영화 : 데이트}
          onAddItem={() => openModal(key)}
          onDeleteItem={(checklistId)=> handleDeleteItem(checklistId,key)}
        />
      );
})}
    </div>
    </div>
    <div className={styles.Couple3}>
            지난 날의 추억
    </div>
     </div>
      </div>
      <CheckListModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedCategory={selectedCategory}
        data={{장소,음식,영화,데이트}}
        handleAddItem={handleAddItem}
       handleDeleteItem={handleDeleteItem}
      /> 
    </div> 
 </div>
     
  );
};

export default Couple;
