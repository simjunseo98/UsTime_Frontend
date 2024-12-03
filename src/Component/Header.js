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

        const response = await api.get(`/couple/getrequest?userId=${userId}`);
        // 대기 상태의 알림만 필터링
        const pendingAlarms = response.data.filter((notif) => notif.status === "대기");
        setAlarm(pendingAlarms);
      } catch (error) {
        console.error("Error fetching Alarm:", error);
      }
    };

    fetchAlarm();
  }, [navigate]);

  // 승인 버튼 클릭 처리
  const handleAccept = async (requestId) => {
    try {
      await api.put(`/couple/approve?requestId=${requestId}`);
      setAlarm((prev) => prev.filter((notif) => notif.requestId !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // 거절 버튼 클릭 처리
  const handleReject = async (requestId) => {
    try {
      await api.put(`/couple/decline?requestId=${requestId}`);
      setAlarm((prev) => prev.filter((notif) => notif.requestId !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
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
              <div key={notif.requestId} className={styles.alarmItem}>
                <p>
                  요청자: {notif.fromUserName} → 수신자: {notif.toUserName}
                </p>
                <p>요청 시간: {notif.requestedAt}</p>
                <div>
                  <button onClick={() => handleAccept(notif.requestId)}>승인</button>
                  <button onClick={() => handleReject(notif.requestId)}>거절</button>
                </div>
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
