import React, { useRef, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import styles from "../assets/style/Sidebar.module.scss";
import { VscEllipsis } from "react-icons/vsc";
const Sidebar = ({ width = 280, isOpen, onClose, onOpen }) => {
    const xPosition = isOpen ? 0 : width; // 사이드바 위치
    const side = useRef();

    // 사이드바 외부 클릭 시 닫기
    const handleClose = useCallback((e) => {
        if (side.current && !side.current.contains(e.target)) {
            onClose();
        }
    }, [onClose]);

    // 사이드바 외부 클릭 시 열기
    const handleOpen = useCallback((e) => {
        if (!isOpen && side.current && !side.current.contains(e.target)) {
            onOpen();
        }
    }, [isOpen, onOpen]);

    useEffect(() => {
        // 이벤트 리스너 등록
        window.addEventListener("click", handleClose); // 닫기
        window.addEventListener("click", handleOpen); // 열기
        return () => {
            // 이벤트 리스너 제거
            window.removeEventListener("click", handleClose);
            window.removeEventListener("click", handleOpen);
        };
    }, [handleClose, handleOpen]);

    return (
        <div className={styles.SidebarContainer}>
            <div
                ref={side}
                className={styles.SidebarPanel}
                style={{
                    width: `${width}px`,
                    height: "100%",
                    transform: `translateX(${-xPosition}px)`, // xPosition에 따라 이동
                }}
            >
                <button className={styles.button} onClick={onClose}><VscEllipsis /></button>
                <ul>
                    <NavLink to="/" className={styles.SidebarNav} aria-current="page">
                        <li>사진첩</li>
                    </NavLink>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
