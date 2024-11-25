import React, {useState,useEffect } from "react";
import { useNavigate, NavLink} from "react-router-dom";
import styles from "../assets/style/Sidebar.module.scss";

const Sidebar = ({isOpen,onClose}) => {
    //로그아웃
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn]= useState(false);
    
      useEffect(() => {
        // 컴포넌트가 마운트될 때 세션 스토리지에서 토큰을 확인하여 로그인 상태 설정
        const token = sessionStorage.getItem('token');
        console.log('토큰 여부'+ token);
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }, []); // 빈 배열로 useEffect가 컴포넌트 마운트 시에만 실행되도록 설정

      //로그아웃 로직
      const handleLogout = ()=>{
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
        console.log("로그아웃이되니",isLoggedIn);
        alert('로그아웃 되었습니다.')
        navigate('/');
      }
    return (
        <div className={`${styles.SidebarContainer} ${
            isOpen ? styles.open : styles.closed
          }`}>
            <button className={styles.closeButton} onClick={onClose}>X</button>

                <ul>
                    <NavLink to="/myprofile" className={styles.SidebarNav} aria-current="page">
                        <li>프로필 관리</li>
                    </NavLink>
                    <NavLink to="/" className={styles.SidebarNav} aria-current="page">
                        <li>사진첩</li>
                    </NavLink>
                    <NavLink to="/" className={styles.SidebarNav} aria-current="page">
                        <li>연동 관리</li>
                    </NavLink>
                        <button className={styles.SidebarNav}
                                onClick={handleLogout}>로그아웃</button>
                </ul>
            </div>
    );
};

export default Sidebar;
