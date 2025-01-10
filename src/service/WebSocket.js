import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// WebSocket 연결을 설정하는 함수
export const connectWebSocket = (userId, onMessageReceived) => {
    const socket = new SockJS("https://www.ustime-backend.store/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect(
        {},
        () => {
            console.log("WebSocket 연결 성공");
            stompClient.subscribe(`/ustime/notifications/${userId}`, (message) => {
                const newNotification = JSON.parse(message.body);
                onMessageReceived(newNotification); // 알림 메시지 수신 시 콜백 함수 호출
            });
        },
        (error) => {
            console.error("WebSocket 연결 실패:", error);
        }
    );

    // 연결 종료 시 호출
    return stompClient;
};

// WebSocket 연결 종료 함수
export const disconnectWebSocket = (stompClient) => {
    if (stompClient) {
        stompClient.disconnect(() => {
            console.log("WebSocket 연결 종료");
        });
    }
};
