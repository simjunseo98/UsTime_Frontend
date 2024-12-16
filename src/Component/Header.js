import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import styles from "../assets/style/Header.module.scss";
import { VscBell, VscMenu } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

// dayjs 라이브러리 설정
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.locale("ko");
dayjs.extend(relativeTime);

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [alarm, setAlarm] = useState([]);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
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

  // 알림 클릭 처리: 상세 정보 요청 및 모달 열기
  const handleNotificationClick = async (notif) => {
    try {
      // 알림 읽음 처리
      if (notif.status === "읽지 않음") {
        await api.put(`/notifications/markAsRead?notificationId=${notif.notificationId}`);
        setAlarm((prev) =>
          prev.map((item) =>
            item.notificationId === notif.notificationId
              ? { ...item, status: "읽음", readText: "읽음" }
              : item
          )
        );
      }

      // 상세 정보 요청
      const typePrefix = notif.type.substring(0, 2); // type의 앞 두 글자 추출
      const { typeId } = notif;

      const response = await api.get(`/notifications/getDetail`, {
        params: { type: typePrefix, typeId },
      });

      setSelectedNotification({ type: typePrefix, data: response.data });
      setModalOpen(true);
    } catch (error) {
      alert("알림 세부 정보를 가져오는 데 실패했습니다.");
    }
  };

  // 알림 삭제 처리
  const handleDeleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/delete?notificationId=${notificationId}`);
      setAlarm((prev) => prev.filter((notif) => notif.notificationId !== notificationId));
      alert("알림이 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // 커플 신청 승인
  const handleApproveCouple = async (requestId) => {
    try {
      await api.put(`/couple/approve?requestId=${requestId}`);
      alert("커플 신청이 승인되었습니다.");
      setModalOpen(false);
      setAlarm((prev) => prev.filter((notif) => notif.typeId !== requestId));
    } catch (error) {
      console.error("Error approving couple request:", error);
      alert("커플 신청 승인 중 문제가 발생했습니다.");
    }
  };

  // 커플 신청 거절
  const handleDeclineCouple = async (requestId) => {
    try {
      await api.put(`/couple/decline?requestId=${requestId}`);
      alert("커플 신청이 거절되었습니다.");
      setModalOpen(false);
      setAlarm((prev) => prev.filter((notif) => notif.typeId !== requestId));
    } catch (error) {
      console.error("Error declining couple request:", error);
      alert("커플 신청 거절 중 문제가 발생했습니다.");
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
      <button onClick={toggleSidebar} className={styles.sidebarIcon}>
        <VscMenu />
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <h3 className={styles.ustime} onClick={home}>
        UsTime
      </h3>

      <button className={styles.alramIcon} onClick={toggleAlarm}>
        <VscBell />
        {alarm.filter((notif) => notif.status === "읽지 않음").length > 0 && (
          <span className={styles.badge}>
            {alarm.filter((notif) => notif.status === "읽지 않음").length}
          </span>
        )}
      </button>

      {alarmOpen && (
        <div className={styles.alarmDropdown} onClick={(e) => e.stopPropagation()}>
          <h3>알림</h3>
          {alarm.length > 0 ? (
            alarm.map((notif) => (
              <div
                key={notif.notificationId}
                className={styles.alarmItem}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  backgroundColor: notif.status === "읽음" ? "#f0f0f0" : "#ffffff",
                  cursor: "pointer",
                }}
              >
                <div className={styles.alarmContent}>
                  <div className={styles.alarmMessage}>
                    <p><strong>메시지:</strong> {notif.message}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notif.notificationId);
                      }}
                      className={styles.deleteButton}
                    >
                      X
                    </button>
                  </div>
                  <div className={styles.readText}>
                    <p className={styles.timestamp}>
                      {dayjs(notif.createdAt).fromNow()}
                    </p>
                    <p>{notif.readText || ""}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noalarm}>새 알림이 없습니다.</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <div className={styles.modalContent}>
            {selectedNotification ? (
              <>
                {selectedNotification.type === "일정" && (
                  <>
                    <h3>일정 정보</h3>
                    <p><strong>제목:</strong> {selectedNotification.data.title}</p>
                    <p><strong>내용:</strong> {selectedNotification.data.description}</p>
                    <p><strong>위치:</strong> {selectedNotification.data.location}</p>
                    <p>
                      <strong>시작날짜:</strong>{" "}
                      {dayjs(selectedNotification.data.startDate).format("YYYY-MM-DD")}
                    </p>
                    <p>
                      <strong>종료날짜:</strong>{" "}
                      {dayjs(selectedNotification.data.endDate).format("YYYY-MM-DD")}
                    </p>
                  </>
                )}
                {selectedNotification.type === "커플" && (
                  <>
                    <h3>커플 관련 정보</h3>
                    <p><strong>요청 ID:</strong> {selectedNotification.data.requestId}</p>
                    <p><strong>보낸사람:</strong> {selectedNotification.data.fromUserName}</p>
                    <p><strong>받는 사람:</strong> {selectedNotification.data.toUserName}</p>
                    <p><strong>상태:</strong> {selectedNotification.data.status}</p>
                    <p><strong>요청 시간:</strong> {selectedNotification.data.requestedAt}</p>
                    {selectedNotification.data.status === "대기" && (
                      <div className={styles.coupleActions}>
                        <button
                          onClick={() => handleApproveCouple(selectedNotification.data.requestId)}
                          className={styles.approveButton}
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleDeclineCouple(selectedNotification.data.requestId)}
                          className={styles.declineButton}
                        >
                          거절
                        </button>
                      </div>
                    )}
                  </>
                )}

              </>
            ) : (
              <p>로딩 중...</p>
            )}
          </div>
        </Modal>
      )}
    </header>
  );
};

export default Header;
