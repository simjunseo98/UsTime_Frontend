import React, { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import styles from "../../assets/style/Sidebar.module.scss";

const Sidebar = ({ isOpen, onClose, }) => {
  //로그아웃
  const navigate = useNavigate();

  //로그아웃 로직
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("coupleId");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    alert('로그아웃 되었습니다.')
    navigate('/');
  }
  return (
    <div className={`${styles.SidebarContainer} ${isOpen ? styles.open : styles.closed
      }`}>
      <button className={styles.closeButton} onClick={onClose}>X</button>

      <ul>
        <NavLink to="/myprofile" className={styles.SidebarNav} aria-current="page">
          <li>프로필 관리</li>
        </NavLink>
        <NavLink to="/changePassword" className={styles.SidebarNav} aria-current="page">
          <li>비밀번호 변경</li>
        </NavLink>
        <NavLink to="/couple" className={styles.SidebarNav} aria-current="page">
          <li>My Couple</li>
        </NavLink>
        <NavLink to="/picture" className={styles.SidebarNav} aria-current="page">
          <li>사진첩</li>
        </NavLink>
        <button className={styles.SidebarNav}
          onClick={handleLogout}>로그아웃</button>
      </ul>
    </div>
  );
};

export default Sidebar;
