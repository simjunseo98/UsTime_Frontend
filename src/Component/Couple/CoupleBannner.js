import React from "react";
import styles from "../../assets/style/Couple/Couple.module.scss";
import { VscHeartFilled } from "react-icons/vsc";
// CoupleBanner 컴포넌트
const CoupleBanner = ({ dDay, daysPassed,handleDDaySet, maxtoday, setDDay }) => {
  return (
    <div className={styles.CoupleBanner}>
      <div className={styles.CoupleUser}>남</div>    
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
        <button onClick={handleDDaySet} className={styles.DDayButton}><VscHeartFilled /></button>
      <p className={`${styles.DDayText}`}>
        {daysPassed !== null ? `D+${daysPassed}일` : "D-Day를 설정하세요!"}
      </p>
        </label>
      </div>
      <div className={styles.CoupleUser}>녀</div>
    </div>
  );
};

export default CoupleBanner;
