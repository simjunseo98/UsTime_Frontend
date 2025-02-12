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
            console.log("📢 API 요청 시작");
            const response= await api.get("/photo/all",{
                params:{coupleId}
            });
            console.log("✅ API 응답 성공:", response);
            console.log("사진데이터",response.data);
            if(response.data.length===0){
                setPicture( Array(9).fill({ photoId: null, photoUrl: notimage, photoTitle: "기본 이미지" }));
            }else{
                setPicture(response.data);
            }
            setLoading(false);
        }catch(error){
            console.error("❌ API 요청 실패:", error.response || error);
            console.log("dd",picture);
          setError(error);
          setLoading(false);
        }
    }
 getPictures();
},[coupleId]);

if (loading) return <Loading/>;
if (error) return <p>Error: {error.message}</p>;

  // ✅ 기본 이미지도 같은 개수로 맞춰서 배열 생성
  const displayPictures =
  picture.length > 0
      ? picture
      : Array(9).fill({ photoId: null, photoUrl: notimage });
console.log("디스플레이 이미지:", displayPictures);

    return(
        <div className={styles.PictureAlbum}>
          {displayPictures.map((image, index) => (
                <img
                    key={image.photoId ? image.photoId: index}
                    src={image.photoUrl}
                    alt=""
                    className={styles.image}
                    onClick={image.photoUrl !== notimage ? () => onImageClick(image) : null}
                    />
                ))}
        </div>
    );
};
export default Album;