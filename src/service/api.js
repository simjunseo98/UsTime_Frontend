import axios from 'axios';

// const baseURL = 'https://trendy-UsTime-backend.store'; 
const baseURL = 'http://ec2-52-79-90-1.ap-northeast-2.compute.amazonaws.com:8085';

const api = axios.create({
    baseURL: baseURL,
    timeout: 30000, 
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