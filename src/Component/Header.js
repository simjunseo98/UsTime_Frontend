// Header.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";  // Sidebar 컴포넌트 임포트
import styles from "../assets/style/Header.module.scss";
import { VscEllipsis, VscComment } from "react-icons/vsc";

const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);  // 사이드바 상태 관리

    // 사이드바 열림/닫힘 상태 토글 함수
    const toggleSidebar = () => {
        setSidebarOpen();
    };

    return (
        <header className={styles.header}>
            {/* Sidebar 컴포넌트 추가 */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)}>
           
            </Sidebar>
            {/* 버튼을 클릭하여 Sidebar 열림/닫힘 상태 변경 */}
            <button className={styles.sidebarIcon} onClick={toggleSidebar}>
                <VscEllipsis />
            </button>
            <h3 className={styles.ustime}>UsTime</h3>
            <button className={styles.messageIcon}>
                <VscComment />
            </button>

        </header>
    );
};

export default Header;
