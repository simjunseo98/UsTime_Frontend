import React, { useEffect, useState } from "react";
import styles from '../../assets/style/Picture/ImageModal.module.scss'; 
import defaultProfilePicture from "../../assets/img/이미지 없음.jpg";

const ImageModal = ( {image, onClose}) => {
    const userId = sessionStorage.getItem("userId");
    const name = sessionStorage.getItem("name");
    const email = sessionStorage.getItem("email");
    const isprofileUrl = sessionStorage.getItem("profileUrl");
    const profileUrl = isprofileUrl === null || isprofileUrl === 'undefined' ? defaultProfilePicture : isprofileUrl;

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
                                 <p className={styles.ProfileName}>{name}</p>
                                 <p className={styles.ProfileEmail}>{email}</p>
                               </div>
                    </div>
                    <div className={styles.ImageModalText}>
                        테스트 용 글
                    1. Context API 활용 (전역 상태 관리)
세션에 담긴 프로필 정보를 전역에서 관리하려면, React Context API를 사용하는 것이 효율적입니다.
이 방법을 사용하면 여러 컴포넌트에서 쉽게 프로필 정보를 가져와 사용할 수 있습니다.

구현 방법:

ProfileContext.js를 생성하여 전역 상태를 관리
ImageModal에서 useContext로 프로필 정보를 가져와 사용
2. Redux (상태 관리 라이브러리)
Redux를 사용하면 전역적으로 프로필 정보를 관리할 수 있습니다.
특히, 애플리케이션이 커질 경우 Redux의 장점이 발휘됩니다.

구현 방법:

profileSlice.js(Redux Toolkit) 생성
store.js에서 등록 후, useSelector로 프로필 정보를 가져오기
3. React Query (비동기 데이터 관리)
React Query를 사용하면 세션 정보를 비동기적으로 불러와 캐싱할 수 있습니다.
서버에서 세션 정보를 가져와야 할 경우 추천하는 방식입니다.
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