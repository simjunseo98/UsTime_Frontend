import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Component
import Header from './Component/Common/Header';

//Page
import NotFound from './page/NotFound';
import Main from './page/Main';
import Login from './page/Login';
import SignUp from './page/SignUp';
import MyProfile from './page/MyProfile';
import ChangePasswordPage from './page/ChangePassword';
import Couple from './page/Couple';
import PrivateRoute from './Component/Common/PrivateRoute';

//css
import styles from './assets/style/Common/MainLayout.module.scss';
import Picture from './page/Picture';



const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <div className={styles.mainLayout}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* 인증된 사용자만 접근 가능한 라우트 */}
            <Route
              path="/main"
              element={
                <PrivateRoute>
                  <Header />
                  <Main />
                </PrivateRoute>
              }
            />
            <Route
              path="/myprofile"
              element={
                <PrivateRoute>
                  <Header />
                  <MyProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/couple"
              element={
                <PrivateRoute>
                  <Header />
                  <Couple />
                </PrivateRoute>
              }
            />
            <Route
              path="/changePassword"
              element={
                <PrivateRoute>
                  <Header />
                  <ChangePasswordPage />
                </PrivateRoute>
              }
            />
              <Route
              path="/picture"
              element={
                <PrivateRoute>
                  <Header />
                <Picture/>
                </PrivateRoute>
              }
            />
            {/* 일치하는 라우트가 없는 경우 처리 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};
export default App;