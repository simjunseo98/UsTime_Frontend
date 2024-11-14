import React, { useRef, useState,useEffect } from "react";
import styles from "../assets/style/Sidebar.module.scss";


const Sidebar=({width=280, children ,isOpen , onClose})=>{
    const [xPosition, setPositon] = useState(width);
    const side =useRef();

    // 외부로부터 열림 상태 제어를 받기 위해 useEffect 사용
  useEffect(() => {
    if (isOpen) {
      setPositon(0);
    } else {
      setPositon(width);
    }
  }, [isOpen, width]);

    // //버튼 클릭시 토글
    // const toggleMenu = () => {
    //     if(xPosition > 0) {
    //         setPositon(0);
    //         setOpen(true);
    //     }else{
    //         setPositon(width);
    //         setOpen(false);
    //     }
    // }

//사이드바 외부 클릭 시 닫히게 하는 함수
const handleClose= async e=>{
    if (side.current && !side.current.contains(e.target)) {
        onClose(); // 외부에서 받은 onClose 함수 호출
    }
    }


useEffect(()=> {
    window.addEventListener('click', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
    };
  })


    return(
 <div className={styles.container}>
      <div ref={side}  className={styles.sidebar} styles={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPosition}px)`}}>
          {/* <button onClick={() => toggleMenu()}
          className={styles.button} >
            {isOpen ? 
            <span>X</span> : <img src="images/avatar.png" alr="contact open button" className={styles.openBtn}/>
            }
          </button>
         */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
    );
};
export default Sidebar;