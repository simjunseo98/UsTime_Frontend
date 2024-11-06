import React,{Component} from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Header from './Component/Header';
import Main from './Component/Main';
import NotFound from './page/NotFound';

//css
import styles from './assets/style/MainLayout.module.scss';


const App = () => {
  return (
    <div className='App'>
  <BrowserRouter>
    <Header/>
    <div className={styles.mainLayout}>
    <Main/>
    </div>
    <Routes>
          <Route path="/" elment={<Main/>}/>
          {/* 일치하는 라우트가 없는 경우 처리 */}
          <Route path="*" elment={<NotFound/>}/>
    </Routes>
  </BrowserRouter>
    </div>
  );
}
export default App;