import React from "react";
import styles from "../../assets/style/Couple/Couple.module.scss";

const CoupleDdayList = ({ specialDays }) => {
  return (
    <div className={styles.CoupleDdayCalculate}>
      <h3>@ 다가오는 기념일 @</h3>
      {Array.isArray(specialDays) && specialDays.length > 0 ? (
        <ul>
          {specialDays.map((day, index) => {
            const isWeekend = day.weekdays === "토요일" || day.weekdays === "일요일";
            const today = new Date();
            const milestoneDate = new Date(day.milestoneDate);
            const isPast = milestoneDate < today;

            const listItemClass = `${isPast ? styles.past : styles.upcoming}`;

            return (
              <li
                key={index}
                className={listItemClass}
                style={isWeekend ? { color: "red" } : {}}
              >
                {day.milestone}: {day.milestoneDate} ({day.weekdays}) ({day.daysLeft}일)
              </li>
            );
          })}
        </ul>
      ) : (
        <p>D-Day를 설정하면 기념일이 표시됩니다!</p>
      )}
    </div>
  );
};

export default CoupleDdayList;
