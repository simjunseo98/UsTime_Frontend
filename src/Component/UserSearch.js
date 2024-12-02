import React, { useEffect, useState, useCallback } from "react";
import styles from '../assets/style/UserSearch.module.scss';
import api from '../service/api.js';

const UserSearch = ({ onSelectUser }) => {
    const [name, setName] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // debounce 함수
    const debounce = (func, delay) => {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
      };
    };

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

    // debouncedSearch는 useCallback으로 메모이제이션
    const debouncedSearch = useCallback(debounce(searchUsers, 500), []);

    useEffect(() => {
        if(name.trim() === '') {
            setError(null);
            setResults([]);
        } else {
            debouncedSearch(name);
        }
    }, [name, debouncedSearch]);  // debouncedSearch를 의존성 배열에 추가

    const handleChange = (e) => {
      setName(e.target.value);
      if (e.target.value.trim() === '') {
        setError(null); // 입력값이 비어있을 때 에러 초기화
      }
    };

    const handleUserClick = (user) => {
      onSelectUser(user);
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
