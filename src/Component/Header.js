import React, { useState} from "react";
import Sidebar from "./Sidebar";  // Sidebar 컴포넌트 임포트
import styles from "../assets/style/Header.module.scss";
import {VscComment,VscEllipsis } from "react-icons/vsc";

const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);  // 사이드바 상태 관리

    const handleOpen = () => {
        console.log("Before setSidebarOpen:", isSidebarOpen); // false 예상
    setSidebarOpen(true);
    };

    const handleClose = () => {
        console.log("Before setSidebarOpen (close):", isSidebarOpen); // true 예상
        setSidebarOpen(false);
    };

    return (
        <header className={styles.header}>
            {/* 버튼을 클릭하여 Sidebar 열림/닫힘 상태 변경 */}
            <button onClick={handleOpen} className={styles.sidebarIcon}><VscEllipsis /></button>
            
            {/* Sidebar 컴포넌트 추가 */}
            {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={handleClose} />}

            <h3 className={styles.ustime}>UsTime</h3>
            <button className={styles.messageIcon}>
                <VscComment />
            </button>

        </header>
    );
};

export default Header;
