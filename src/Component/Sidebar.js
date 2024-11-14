// Sidebar.js
import React, { useRef, useEffect, useCallback} from "react";
import styles from "../assets/style/Sidebar.module.scss";

const Sidebar = ({ width = 280, children, isOpen, onClose }) => {
    const xPosition = isOpen ? 0 : width;  // 열림 상태에 따라 포지션을 설정
    const side = useRef();

    // 사이드바 외부 클릭 시 닫기
    const handleClose =useCallback((e) => {
        if (side.current && !side.current.contains(e.target)) {
            onClose(); // 외부에서 전달받은 onClose 함수 호출
        }
    },[onClose]);

    useEffect(() => {
        window.addEventListener("click", handleClose);
        return () => {
            window.removeEventListener("click", handleClose);
        };
    }, [handleClose]);

    return (
        <div className={styles.SidebarContainer}>
            <div
                ref={side}
                className={styles.SidebarPanel}
                style={{
                    width: `${width}px`,
                    height: "100%",
                    transform: `translateX(${-xPosition}px)`, // xPosition에 따라 열림/닫힘 설정
                }}
            >
                <div className={styles.SidebarContent}>{children}</div>
            </div>
        </div>
    );
};

export default Sidebar;
