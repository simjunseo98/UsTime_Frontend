import React from 'react';
import { Navigate } from 'react-router-dom';

// 인증되지 않으면 로그인 페이지로 리다이렉트
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");  
  if (!token) {
    alert("로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.");
    return <Navigate to="/" />; 
  }

  return children;
};

export default PrivateRoute;

