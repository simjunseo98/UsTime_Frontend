import React from "react";
import styles from "../../assets/style/Picture/Picture.module.scss";

const Album =() =>{
// const [picture, setPicture]= useState([]);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);

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
            <img alt="사진" className={styles.image}></img>
        </div>
    );
};
export default Album;