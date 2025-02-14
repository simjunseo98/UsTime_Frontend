import React, { useEffect, useState } from "react";
import styles from '../../assets/style/Picture/ImageModal.module.scss'; 
import defaultProfilePicture from "../../assets/img/이미지 없음.jpg";

const ImageModal = ( {image, onClose}) => {
    const userId = sessionStorage.getItem("userId");
    const email = sessionStorage.getItem("email");
    const isprofileUrl = sessionStorage.getItem("profileUrl");
    const profileUrl = isprofileUrl === null || isprofileUrl === 'undefined' ? defaultProfilePicture : isprofileUrl;
   /* const { userInfo } = image; */
    // 부모 컴포넌트에서 받은 사용자 정보
    
    const [comment , setComment]= useState(() =>{
        return JSON.parse(localStorage.getItem("comment")) || [];
    });
    const [inputText ,setInputText]=useState("");

    useEffect(() => {
        localStorage.setItem("comment", JSON.stringify(comment));
    }, [comment]);

    const handleAddComment = () => {
        if (inputText.trim() === "") return; // 빈 댓글 방지
        const newComment = {
            id: userId,
            text: inputText, // 입력한 댓글 내용
        };
        setComment((prevComment) => [newComment, ...prevComment]); // 최신 댓글이 위에 보이도록 추가
        setInputText(""); // 입력창 초기화
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAddComment();
        }
    };
    
    if(!image) return null;

    return (
        <div className={styles.ModalOverlay} onClick={onClose}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.ImageModalContainer}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <img src={image.photoUrl} alt={image.photoTitle} className={styles.modalImage} />
            </div>
                <div className={styles.ImageModalContainer2}>
                    <div className={styles.ImageModalHeader}>
                            <img
                                 src={ profileUrl }
                                 alt="프로필 사진"
                                 className={styles.ImageModalProfilePicture}
                               />
                               <div className={styles.ProfileText}>
                                 <p className={styles.ProfileName}>{image.uploadedByUsername}</p>
                                 <p className={styles.ProfileEmail}>{email}</p>
                               </div>
                    </div>
                    <div className={styles.ImageModalText}>
                        {image.caption}
                    </div>
<div className={styles.ImageModalComment}>
    {comment.length > 0 ? (
        comment.map((comment) => <CommentItem key={comment.id} comment={comment} />)
    ) : (
        <p className={styles.NoComments}>아직 댓글이 없습니다.</p>
    )}
</div>
                    <div className={styles.ImageModalCommentInput}>
                       <input 
                       type="text"
                       placeholder="댓글을 입력하세요"
                       className={styles.Inputstyle}
                       onChange={(e)=>setInputText(e.target.value)}
                       onKeyDown={handleKeyPress}
                       value={inputText}
                       ></input>
                       <button className={styles.CommentButton} onClick={handleAddComment}>입력</button>
                    </div>
                </div>
                </div>
        </div>
    );
};
const CommentItem = React.memo(({ comment }) => (
    <div className={styles.CommentItem}>
        <strong>{comment.author}</strong>: {comment.text}
    </div>
));
export default ImageModal;