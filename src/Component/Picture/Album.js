import React from "react";
import styles from "../../assets/style/Picture/Picture.module.scss";

const Album =({url}) =>{
// const [picture, setPicture]= useState([]);

// useEffect(() =>{
//     const getPictures = async () => {
//         try{
//             const response= await api.get("");
//             setPicture(response.data);
//             setLoading(false);
//         }catch(error){
//           setError();
//           setLoading(false);
//         }
//     }
//  getPictures();
// },[]);


    return(
        <div className={styles.PictureAlbum}>
            <img src={url} alt="사진" className={styles.image}></img>
        </div>
    );
};
export default Album;