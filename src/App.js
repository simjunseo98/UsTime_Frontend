import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Header from './Component/Header';
import Main from './Component/Main';
import NotFound from './page/NotFound';
import Login from './page/Login';
import SignUp from './page/SignUp';
import MyProfile from './page/MyProfile';


//css
import styles from './assets/style/MainLayout.module.scss';



const App = () => {
  return (
    <div className='App'>
  <BrowserRouter>
    <div className={styles.mainLayout}>
    <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
         {/* Main 페이지부터 Header를 포함 */}
         <Route
            path="/main"
            element={
              <>
                <Header />
                <Main />
              </>
            }
          />
          <Route path="/myprofile" element={
            <>
            <Header/>
            <MyProfile/>
            </>
            }>
            </Route>
          {/* 일치하는 라우트가 없는 경우 처리 */}
          <Route path="*" element={<NotFound/>}/>
    </Routes>  
    </div>
  </BrowserRouter>
    </div>
  );
}
export default App;