import React, { useState,useEffect} from "react";
import Sidebar from "./Sidebar";  // Sidebar 컴포넌트 임포트
import styles from "../assets/style/Header.module.scss";
import {VscBell,VscMenu} from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);  // 사이드바 상태 관리
    const [alarm, setAlarm]=useState([]); // 알람 데이터 상태관리
    const [alarmOpen, setAlarmOpen] =useState(false); //알람창 상태 관리
    const navigate = useNavigate();
 
    //알림창 관리

  // 알림창 열기/닫기 토글
  const toggleAlarm = () => {
    setAlarmOpen(!alarmOpen);
  };
   // API 요청으로 알림 데이터 가져오기
   useEffect(() => {
    const fetchAlarm = async () => {
      try {
        const response = await fetch("/api/Alarm"); // 서버 API
        const data = await response.json();
        setAlarm(data);
      } catch (error) {
        console.error("Error fetching Alarm:", error);
      }
    };

    fetchAlarm();

    // 주기적으로 알림 데이터 업데이트
    const interval = setInterval(fetchAlarm, 30000);
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

 // 승인 버튼 클릭 처리
 const handleAccept = async (id) => {
    try {
      const response = await fetch(`/api/Alarm/${id}/accept`, { method: "POST" });
      if (response.ok) {
        // 성공적으로 처리된 경우, 상태를 업데이트
        setAlarm((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, status: "accepted" } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // 거절 버튼 클릭 처리
  const handleReject = async (id) => {
    try {
      const response = await fetch(`/api/Alarm/${id}/reject`, { method: "POST" });
      if (response.ok) {
        // 성공적으로 처리된 경우, 상태를 업데이트
        setAlarm((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, status: "rejected" } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

    // 사이드바 관리
     // 사이드바 열기/닫기 토글
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
    const home = () => {
     navigate("/main");
    }

    return (
        <header className={styles.header}>
            {/* 버튼을 클릭하여 Sidebar 열림/닫힘 상태 변경 */}
            <button onClick={toggleSidebar} className={styles.sidebarIcon}><VscMenu /></button>
            
            {/* Sidebar 컴포넌트 추가 */}
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            <h3 className={styles.ustime} onClick={home}>UsTime</h3>

            {/* 알림창 */}
            <button className={styles.alramIcon} onClick={toggleAlarm}>
          <VscBell />
          {alarm.length > 0 && <span className={styles.badge}>{alarm.length}</span>}
        </button>
        {alarmOpen && (
          <div className={styles.alarmDropdown}>
            {alarm.length > 0 ? (
              alarm.map((notif, index) => (
                <div key={index} className={styles.alarmItem}>
                  <p>{notif.message}</p>
                  <span className={styles.timestamp}>{notif.timestamp}</span>

                  {notif.status === "pending" ? (
                  <div>
                    <button onClick={() => handleAccept(notif.id)}>승인</button>
                    <button onClick={() => handleReject(notif.id)}>거절</button>
                  </div>
                ) : notif.status === "accepted" ? (
                  <p className={styles.statusAccepted}>승인 완료</p>
                ) : (
                  <p className={styles.statusRejected}>거절됨</p>
                )}
                </div>
              ))
            ) : (
              <p className={styles.noalarm}>새 알림이 없습니다.</p>
            )}
          </div>
        )}

        </header>
    );
};

export default Header;
