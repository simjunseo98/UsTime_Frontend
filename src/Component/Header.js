import React from "react";
import styles from "../assets/style/Header.module.scss";
import {VscEllipsis,VscComment} from "react-icons/vsc";

function Header(props){
   
   return(
<header className={styles.header}>
<button className={styles.sidebar}><VscEllipsis />
</button>
<h3 className={styles.ustime}>UsTime</h3>
<button className={styles.messeage}><VscComment />
</button>
</header>
); 
}
export default Header;