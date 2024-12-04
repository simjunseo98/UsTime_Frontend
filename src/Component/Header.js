import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // Sidebar 컴포넌트 임포트
import styles from "../assets/style/Header.module.scss";
import { VscBell, VscMenu } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태 관리
  const [alarm, setAlarm] = useState([]); // 알람 데이터 상태 관리
  const [alarmOpen, setAlarmOpen] = useState(false); // 알람창 상태 관리
  const navigate = useNavigate();

  // 알림창 열기/닫기 토글
  const toggleAlarm = () => {
    setAlarmOpen(!alarmOpen);
  };

  // API 요청으로 알림 데이터 가져오기
  useEffect(() => {
    const fetchAlarm = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          alert("로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.");
          navigate("/");
          return;
        }

        const response = await api.get(`/notifications/getNotify?userId=${userId}`);
        setAlarm(response.data);
      } catch (error) {
        console.error("Error fetching Alarm:", error);
      }
    };

    fetchAlarm();
  }, [navigate]);

  // 알림 읽음 처리
  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/markAsRead?notificationId=${notificationId}`);
      // 알림 상태 업데이트
      setAlarm((prev) =>
        prev.map((notif) =>
          notif.notificationId === notificationId
            ? { ...notif, status: "읽음" }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // 사이드바 열기/닫기 토글
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const home = () => {
    navigate("/main");
  };

  return (
    <header className={styles.header}>
      {/* 버튼을 클릭하여 Sidebar 열림/닫힘 상태 변경 */}
      <button onClick={toggleSidebar} className={styles.sidebarIcon}>
        <VscMenu />
      </button>

      {/* Sidebar 컴포넌트 추가 */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <h3 className={styles.ustime} onClick={home}>
        UsTime
      </h3>

      {/* 알림창 */}
      <button className={styles.alramIcon} onClick={toggleAlarm}>
        <VscBell />
        {alarm.length > 0 && <span className={styles.badge}>{alarm.length}</span>}
      </button>
      {alarmOpen && (
        <div className={styles.alarmDropdown}>
          {alarm.length > 0 ? (
            alarm.map((notif) => (
              <div
                key={notif.notificationId}
                className={styles.alarmItem}
                onClick={() => handleMarkAsRead(notif.notificationId)}
                style={{
                  backgroundColor: notif.status === "읽음" ? "#f0f0f0" : "#ffffff",
                  cursor: "pointer",
                }}
              >
                <p><strong>메시지:</strong> {notif.message}</p>
                <p><strong>상태:</strong> {notif.status}</p>
                <p><strong>생성일시:</strong> {new Date(notif.createdAt).toLocaleString()}</p>
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
