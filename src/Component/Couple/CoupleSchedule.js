import React, { useEffect, useState, useCallback } from "react";
import styles from "../../assets/style/Couple/UpcomingSchedules.module.scss";
import moment from "moment";
import api from "../../service/api";

const CoupleSchedule = ({ userId, coupleId }) => {
    const [weekSchedules, setWeekSchedules] = useState([]);

    // 이번주 일정 불러오기
    const fetchWeekSchedules = useCallback(async () => {
        try {
            const today = new Date();
            const formattedDate = today.toISOString().split("T")[0];
            
            const params = {
                userId,
                date: formattedDate,
            };
            
            if (coupleId) {
                params.coupleId = coupleId;
            }
            const response = await api.get("/calendar/week", { params });
            console.log("response:",response.data);
            setWeekSchedules(response.data);
        } catch (error) {
            console.error("일정을 불러오는 중 오류가 발생했습니다:", error);
        }
    },[userId,coupleId]);

    useEffect(() => {
        fetchWeekSchedules(); 
    }, [fetchWeekSchedules]); 

    if (!weekSchedules || weekSchedules.length === 0) {
        return <p>다가오는 일정이 없습니다.</p>;
    }
    const today = moment().startOf('day');
    return (
        <div className={styles.UpcomingSchedules}>
            <h4>이번 주 일정</h4>
            <ul>
                {weekSchedules.map((schedule) => {
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
