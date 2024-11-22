import React, { useRef,useState,useEffect } from "react";
import { useNavigate, NavLink} from "react-router-dom";
import styles from "../assets/style/Sidebar.module.scss";
import { VscEllipsis } from "react-icons/vsc";

const Sidebar = ({ width = 280}) => {
    //사이드바 
    const [isOpen,setOpen]=useState(false);
    const [xPosition,setX]=useState(width);
    const side = useRef();
    console.log("Sidebar isOpen:", isOpen); // Header에서 전달된 값 확인

    //로그아웃
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn]= useState(false);
    

    const toggleMenu = () => {
        if (xPosition > 0) {
          setX(0);
          setOpen(true);
        } else {
          setX(width);
          setOpen(false);
        }
      };

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
        <div className={styles.SidebarContainer}>
            <div
                ref={side}
                className={styles.SidebarPanel}
                style={{
                    width: `${width}px`,
                    height: "100%",
                    transform: `translatex(${-xPosition}px)`
                }}
            >
                <button className={styles.button} onClick={toggleMenu} > {isOpen ? 
            <span>X</span> :<VscEllipsis />
            }</button>

                <ul>
                    <NavLink to="/" className={styles.SidebarNav} aria-current="page">
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
        </div>
    );
};

export default Sidebar;
