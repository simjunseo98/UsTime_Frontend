import React, { useState, useEffect } from "react";
import styles from "../assets/style/UserSearch.module.scss";
import api from "../service/api.js";

const UserSearch = ({ onSelectUser }) => {
    const [name, setName] = useState("");
    const [results, setResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastSearch, setLastSearch] = useState("");

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

    useEffect(() => {
        if (name.trim() === "") {
            setError(null);
            setResults([]);
        } else if (name !== lastSearch) {
            setLastSearch(name);
            searchUsers(name);
        }
    }, [name, lastSearch]);

    const handleChange = (e) => {
        setName(e.target.value);
        if (e.target.value.trim() === "") {
            setError(null);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user); // 선택된 유저 정보 업데이트
    };

    const handleSendRequest = async () => {
        if (!selectedUser) {
            alert("연동할 사용자를 선택해주세요.");
            return;
        }

        try {
            const fromUserId = sessionStorage.getItem("userId");
            await api.post("/couple/request", null, {
                params: {
                    fromUserId,
                    toUserId: selectedUser.userId,
                },
            });
            alert("신청이 성공적으로 보내졌습니다.");
            onSelectUser(selectedUser); // 성공 시 부모 컴포넌트에 알림
            setSelectedUser(null); // 선택된 유저 초기화
        } catch (error) {
            alert("커플 신청에 실패했습니다.");
            console.error(error);
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
            {selectedUser && (
                <div className={styles.selectedUserContainer}>
                    <p className={styles.selectedUserText}>
                       <strong>{selectedUser.name}</strong>    님에게 요청을 보내시겠습니까?
                    </p>
                    <button className={styles.sendButton} onClick={handleSendRequest}>
                        보내기
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserSearch;
