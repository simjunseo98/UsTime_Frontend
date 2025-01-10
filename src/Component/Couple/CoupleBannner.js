import React from "react";
import styles from "../../assets/style/Couple/Couple.module.scss";

// CoupleBanner 컴포넌트
const CoupleBanner = ({ couplePhoto, dDay, daysPassed, handlePhotoUpload, handleDDaySet, maxtoday, setDDay }) => {
  return (
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
  );
};

export default CoupleBanner;
