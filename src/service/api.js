import axios from 'axios';

const baseURL = 'https://www.ustime-backend.store'; 

const api = axios.create({
    baseURL: baseURL,
    timeout: 30000, 
});

api.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 설정: 401, 403 에러 처리
api.interceptors.response.use(
    response => response,
    error => {

        const excludedUrls = ['/user/login', '/user/signup']; // 세션 만료 메시지를 표시하지 않을 URL들
        const requestUrl = error?.config?.url;

        if (error.response && error.response.status === 403 && !excludedUrls.some(url => requestUrl?.includes(url))) {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            sessionStorage.clear();
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;
