import axios from 'axios';

const baseURL = 'https://www.ustime-backend.store'; 


const api = axios.create({
    baseURL: baseURL,
    timeout: 30000, 
    withCredentials: true,
});


// 요청 인터셉터 설정: 헤더에 토큰 추가
api.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('헤더에 추가된 토큰 :', token);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;