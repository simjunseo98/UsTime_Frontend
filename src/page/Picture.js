import React from "react";
import styles from "../../src/assets/style/Picture/Picture.module.scss";
import Album from "../Component/Picture/Album";

const Picture = () =>{
    return(

        <div className={styles.PictureConstainer}>
           <div className={styles.Album}>
            <Album/>
            </div>
            <button className={styles.PictureButton}>+</button>
        </div>
    );
};

export default Picture;