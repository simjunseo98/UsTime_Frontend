import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const baseURL = 'https://www.ustime-backend.store';


const api = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,  // 토큰을 헤더에 추가
    },
});


// 응답 인터셉터 추가
api.interceptors.response.use(
    response => response,  // 성공적인 응답은 그대로 반환
    error => {
        const navigate = useNavigate();

        if (error.response && error.response.status === 401) { // 토큰 만료 시
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("coupleId");
            sessionStorage.removeItem("name");
            sessionStorage.removeItem("email");
            navigate("/");
        }

        return Promise.reject(error);
    }
);
export default api;