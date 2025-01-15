import React from "react";
import styles from "../../assets/style/Couple/UpcomingSchedules.module.scss";
import moment from "moment";

const CoupleSchedule = ({ schedules }) => {
    if (!schedules || schedules.length === 0) {
        return <p>다가오는 일정이 없습니다.</p>;
    }
    const today = moment().startOf('day');
    return (
        <div className={styles.UpcomingSchedules}>
      <h4>이번 주 일정</h4>
      <ul>
      {schedules.map((schedule) => {
                    const startDate = moment(schedule.startDate).startOf('day');
                    const daysRemaining = startDate.diff(today, 'days');
                    
                    return (
                        <li key={schedule.scheduleId} className={styles.scheduleItem}>
                            <p>D-{daysRemaining}</p>
                            <h4>{schedule.title}</h4>
                        </li>
                    );
                })}

      </ul>
    </div>
  );
};

export default CoupleSchedule;
