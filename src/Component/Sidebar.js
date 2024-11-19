import React, { useRef,useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "../assets/style/Sidebar.module.scss";
import { VscEllipsis } from "react-icons/vsc";

const Sidebar = ({ width = 280}) => {
    const [isOpen,setOpen]=useState(false);
    const [xPosition,setX]=useState(width);
    const side = useRef();

    console.log("Sidebar isOpen:", isOpen); // Header에서 전달된 값 확인

    const toggleMenu = () => {
        if (xPosition > 0) {
          setX(0);
          setOpen(true);
        } else {
          setX(width);
          setOpen(false);
        }
      };
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
                        <li>사진첩</li>
                    </NavLink>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
