import React, { useEffect, useState } from "react";
import styles from "../../assets/style/Picture/Picture.module.scss";
import api from "../../service/api.js";
import Loading from "../../Component/Common/Loading.js";


const Album =() =>{
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [picture, setPicture]= useState([]);

useEffect(() =>{
    const getPictures = async () => {
        try{
            const response= await api.get("");
            setPicture(response.data);
            setLoading(false);
        }catch(error){
          setError();
          setLoading(false);
        }
    }
 getPictures();
},[]);

if (loading) return <Loading/>;
if (error) return <p>Error: {error}</p>;

    return(
        <div className={styles.PictureAlbum}>
              {picture.map((image, index) => (
                image.url ? (
                    <img key={index} src={image.url} alt="Gallery"/>
                ) : (
                    <p key={index}>이미지를 불러올 수 없습니다.</p>
                )
            ))}
        </div>
    );
};
export default Album;