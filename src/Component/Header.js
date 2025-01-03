import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import styles from "../assets/style/Header.module.scss";
import { VscBell, VscMenu } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import api from "../service/api";
import userImage from "../assets/img/이미지 없음.jpg";
import { Stomp } from "@stomp/stompjs"; // Stomp.js 라이브러리
import SockJS from "sockjs-client"; // SockJS 클라이언트
import { ToastContainer, toast } from "react-toastify";

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


  const userId = sessionStorage.getItem("userId");

  // 알림창 열기/닫기 토글
  const toggleAlarm = () => {
    setAlarmOpen(!alarmOpen);
  };

  // API 요청으로 알림 데이터 가져오기
  useEffect(() => {
    const fetchAlarm = async () => {
      try {
        if (!userId) {
          alert("로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.");
          navigate("/");
          return;
        }

        const response = await api.get(`/notifications/getNotify?userId=${userId}`);
        setAlarm(response.data); // 알림 목록을 처음에만 가져옴
      } catch (error) {
        console.error("Error fetching Alarm:", error);
      }
    };

    // 처음에 API로 알림을 가져옵니다.
    fetchAlarm();

    // WebSocket 연결 및 알림 수신
    const socket = new SockJS("https://www.ustime-backend.store/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      {},
      () => {
        console.log("웹소켓이 연결 되었습니다.");
        stompClient.subscribe(`/ustime/notifications/${userId}`, (message) => {
          const newNotification = JSON.parse(message.body);

          // coupleId 확인 및 세션 저장
          if (newNotification.coupleId) {
            sessionStorage.setItem("coupleId", newNotification.coupleId);
            console.log("coupleId가 세션에 저장되었습니다:", newNotification.coupleId);
          }

          // 알림 메시지 결정 (coupleId 여부에 따라 다르게 처리)
          const notificationMessage = newNotification.coupleId
            ? newNotification.notification.message
            : newNotification.message;

          // 새 알림만 상태에 추가
          setAlarm((prev) => [newNotification, ...prev]);

          toast.info(`새 알림: ${notificationMessage}`, {
            position: "bottom-center",
            autoClose: 3000,  // 자동으로 3초 후 사라짐
            hideProgressBar: true,
            closeButton: true,
          });

          // 새 알림이 왔을 때만 fetchAlarm 호출
          fetchAlarm();
        });
      },
      (error) => {
        console.error("WebSocket 연결 실패:", error);
      }
    );

    // WebSocket 연결 해제 시 연결 종료
    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, [userId, navigate]);


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
      const typePrefix = notif.type.substring(0, 2);
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
                  <div className={styles.modalSchedule}>
                    <h3>일정 정보</h3>
                    <div className={styles.modalDate}>
                      <p>
                        <strong>시작날짜:</strong>{" "}
                        {dayjs(selectedNotification.data.startDate).format("YYYY-MM-DD(dddd)")}
                      </p>
                      <p className={styles.modalIcon}>》</p>
                      <p>
                        <strong>종료날짜:</strong>{" "}
                        {dayjs(selectedNotification.data.endDate).format("YYYY-MM-DD(dddd)")}
                      </p>
                    </div>
                    <div className={styles.modalScheduleSection}>
                      <p className={styles.modalScheduleSectionTitle}><strong>제목:</strong> {selectedNotification.data.title}</p>
                      <p className={styles.modalScheduleSectionDescription}><strong>내용:</strong> {selectedNotification.data.description}</p>
                      <p><strong>위치:</strong> {selectedNotification.data.location}</p></div>
                  </div>
                )}
                {selectedNotification.type === "커플" && (
                  <div className={styles.CoupleRequest}>
                    <h3>커플 관련 정보</h3>
                    <p><strong>상태:</strong> {selectedNotification.data.status}</p>
                    <div className={styles.CoupleRequestUser}>
                      <p> <img src={userImage} alt=""></img><strong>보낸사람:</strong> {selectedNotification.data.fromUserName}</p>
                      <p className={styles.modalIcon}>》</p>
                      <p> <img src={userImage} alt=""></img><strong>받는 사람:</strong> {selectedNotification.data.toUserName}</p>
                    </div>
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
                  </div>
                )}

              </>
            ) : (
              <p>로딩 중...</p>
            )}
          </div>
        </Modal>
      )}
      <ToastContainer />
    </header>
  );
};

export default Header;
