import React, { useEffect, useState } from "react";
import styles from '../assets/style/UserSearch.module.scss';
import api from '../service/api.js';

const UserSearch = ({ onSelectUser }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const debounce = (func, delay) => {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
      };
    };
  
    const searchUsers = async (query) => {
      if (!query) {
        setResults([]);
        return;
      }
  
      setLoading(true);
      try {
        const response = await api.get(`/users/search?query=${query}`);
        setResults(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    const debouncedSearch = debounce(searchUsers, 500);
  
    useEffect(() => {
        if(query.trim()=== ''){
            setError(null);
            setResults([]);
        }else{
      debouncedSearch(query);
        }
    }, [query]);
  
    const handleChange = (e) => {
      setQuery(e.target.value);
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
          value={query}
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
  