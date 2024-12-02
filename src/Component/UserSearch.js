import React, { useEffect, useState } from "react";
import styles from '../assets/style/UserSearch.module.scss';
import api from '../service/api.js';
import { useNavigate } from "react-router-dom";

const UserSearch = ({ onSelectUser }) => {
    const [name, setName] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastSearch, setLastSearch] = useState('');  // 이전 검색어를 추적하는 상태
    const [myUserId, setMyUserId] = useState(null); // myUserId 상태 추가
    const navigate = useNavigate();

    // 세션 스토리지에서 myUserId를 가져오기
    useEffect(() => {
        const userId = sessionStorage.getItem('userId'); // sessionStorage에서 값 가져오기
        if (userId) {
            setMyUserId(userId); // myUserId 상태 업데이트
        }
    }, []);

    // 사용자 검색 함수
    const searchUsers = async (name) => {
        if (!name) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/couple/search?name=${name}`);
            setResults(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect를 사용하여 이름이 바뀔 때만 검색
    useEffect(() => {
        if (name.trim() === '') {
            setError(null);
            setResults([]);
        } else if (name !== lastSearch) {
            setLastSearch(name);  // 검색어가 바뀔 때마다 업데이트
            searchUsers(name);    // 새 검색어로 검색 요청
        }
    }, [name, lastSearch]);  // name이나 lastSearch가 바뀌면 실행

    const handleChange = (e) => {
        setName(e.target.value);
        if (e.target.value.trim() === '') {
            setError(null); // 입력값이 비어있을 때 에러 초기화
        }
    };

    const handleUserClick = (user) => {
        console.log("Selected User ID: ", user.name);
        onSelectUser(user.name);
        
        // myUserId가 존재할 때만 커플 신청
        // if (myUserId) {
        //     createCoupleRequest(myUserId, user.userId);
        // } else {
        //     alert("로그인 정보가 없습니다.");
        // }
    };

    // 커플 신청 API 호출
    const createCoupleRequest = async (fromUserId, toUserId) => {
        try {
            const response = await api.post('/couple/request', null, {
                params: {
                    fromUserId,
                    toUserId
                }
            });
            console.log("보내진 데이터: ", response);
            navigate("/main")
            alert("신청이 성공적으로 보내졌습니다.");
        } catch (error) {
            alert("커플 신청에 실패했습니다.");
        }
    };

    return (
        <div className={styles.userSearchContainer}>
            <input
                type="text"
                value={name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                className={styles.userSearchInput}
            />
            {loading && <p className={styles.userSearchLoading}>검색 중...</p>}
            {error && <p className={styles.userSearchError}>에러가 발생했습니다: {error.message}</p>}
            <ul className={styles.userSearchResults}>
                {results.map((user) => (
                    <li key={user.userId} onClick={() => handleUserClick(user)}>
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSearch;
