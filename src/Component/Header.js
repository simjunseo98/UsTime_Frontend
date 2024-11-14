import React,{useState} from "react";
import styles from "../assets/style/Header.module.scss";
import {VscEllipsis,VscComment} from "react-icons/vsc";
import Sidebar from "./Sidebar";

const Header=()=>{
   const [isSidebarOpen, setSidebarOpen] = useState(false);
   // 사이드바 열림/닫힘 상태를 토글하는 함수
  const toggleSidebar = () => {
   setSidebarOpen((prev) => !prev);
 };

 // 사이드바 닫기
 const closeSidebar = () => {
   setSidebarOpen(false);
 };

   return(
<header className={styles.header}>
<button className={styles.sidebar} onClick={toggleSidebar} ><VscEllipsis />
</button>
   <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}></Sidebar>
<h3 className={styles.ustime}>UsTime</h3>
<button className={styles.messeage}><VscComment />
</button>
</header>
); 
}
export default Header;