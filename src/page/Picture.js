import React from "react";
import styles from "../../src/assets/style/Picture/Picture.module.scss";
// import Album from "../Component/Picture/Album";

// import image1 from "../assets/img/test/1.png";
// import image2 from "../assets/img/test/2.png";
// import image3 from "../assets/img/test/3.png";
// import image4 from "../assets/img/test/4.png";
// import image5 from "../assets/img/test/5.png";
// import image6 from "../assets/img/test/6.png";
// import image7 from "../assets/img/test/7.png";
// import image8 from "../assets/img/test/8.png";
// import image9 from "../assets/img/test/9.png";
const Picture = () =>{
    // const [images] =useState([
    //     { url:image1},
    //         {url:image2},
    //         {url:image3},
    //         {url:image4},
    //         {url:image5},
    //         {url:image6},
    //         {url:image7},
    //         {url:image8},
    //         {url:image9}
    // ]);
    return(
        <div className={styles.PictureConstainer}>
           {/* <div className={styles.Album}>
           {images.map((image,index)=> (
                <Album key={index} url={image.url}/>
                ))}             
                </div> */}
            <button className={styles.PictureButton}>+</button>

        </div>
    );
};

export default Picture;