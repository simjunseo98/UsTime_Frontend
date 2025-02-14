import React, { useEffect, useState } from "react";
import styles from "../../assets/style/Picture/Picture.module.scss";
import api from "../../service/api.js";
import Loading from "../../Component/Common/Loading.js";
import notimage from "../../assets/img/이미지 없음.jpg";

const Album =({coupleId,onImageClick}) =>{
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [picture, setPicture]= useState([]);

useEffect(() =>{
    if(!coupleId) return;
    const getPictures = async () => {
        try{
            const response= await api.get("/photo/all",{
                params:{coupleId}
            });
            if(response.data.length===0){
                setPicture([]);
            }else{
                setPicture(response.data);
            }
            setLoading(false);
        }catch(error){
          setError(error);
          setLoading(false);
        }
    }
 getPictures();
},[coupleId]);

if (loading) return <Loading/>;
if (error) return <p>Error: {error.message}</p>;

const minLayoutSize = 9;
const missingCount = Math.max(0, minLayoutSize - picture.length);
const displayPictures = picture.length > 0 ? picture : new Array(missingCount).fill(null);
    return(
        <div className={styles.PictureAlbum}>
      {displayPictures.length > 0 ? (
                displayPictures.map((image, index) => (
                    <div key={index} className={styles.imageContainer}>
                        {image ? (
                            <img
                                src={image.photoUrl}
                                alt=""
                                className={styles.image}
                                onClick={image.photoUrl !== notimage ? () => onImageClick(image) : null}
                            />
                        ) : (
                            <p className={styles.noImageText}>이미지가 없습니다</p> // 이미지가 없으면 텍스트 표시
                        )}
                    </div>
                ))
            ) : (
                <p className={styles.noImageText}>이미지가 없습니다</p> // 데이터가 아예 없을 경우 텍스트 표시
            )}
        </div>
    );
};
export default Album;