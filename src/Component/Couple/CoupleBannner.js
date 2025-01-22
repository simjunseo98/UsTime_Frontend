import React from "react";
import styles from "../../assets/style/Couple/Couple.module.scss";
import { VscHeartFilled } from "react-icons/vsc";
import WheelDatepicker from "../Common/WheelDatePicker";
// CoupleBanner 컴포넌트
const CoupleBanner = ({ dDay, daysPassed,handleDDaySet, maxtoday, setDDay }) => {
  return (
    <div className={styles.CoupleBanner}>
      <div className={styles.CoupleUser}>남</div>    
      <div className={styles.DDayInputWrapper}>
          <WheelDatepicker
            initialDate={dDay} // 초기 날짜
            maxDate={maxtoday} // 선택 가능한 최대 날짜
            onDateChange={setDDay} // 상태 업데이트
          />
        <button onClick={handleDDaySet} className={styles.DDayButton}><VscHeartFilled /></button>
      <p className={`${styles.DDayText}`}>
        {daysPassed !== null ? `D+${daysPassed}일` : "D-Day를 설정하세요!"}
      </p>
      </div>
      <div className={styles.CoupleUser}>녀</div>
    </div>
  );
};

export default CoupleBanner;
