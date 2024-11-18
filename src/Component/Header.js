// Header.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";  // Sidebar 컴포넌트 임포트
import styles from "../assets/style/Header.module.scss";
import {VscComment } from "react-icons/vsc";

const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);  // 사이드바 상태 관리

   // 사이드바 열림/닫힘 상태 토글 함수
    const toggleSidebar = () => {
        setSidebarOpen();
    };

    return (
        <header className={styles.header}>
            {/* Sidebar 컴포넌트 추가 */}
            <Sidebar isOpen={isSidebarOpen} // 열림 상태
                     onClose={() => setSidebarOpen(false)}//닫힘 동작
                     onOpen={()=> setSidebarOpen(true)} //열기 동작
                     >    
            </Sidebar>
            {/* 버튼을 클릭하여 Sidebar 열림/닫힘 상태 변경 */}
            <button className={styles.sidebarIcon} 
            onClick={toggleSidebar}
            data-role="open-sidebar">
            </button>
            <h3 className={styles.ustime}>UsTime</h3>
            <button className={styles.messageIcon}>
                <VscComment />
            </button>

        </header>
    );
};

export default Header;
