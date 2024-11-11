import React from 'react';
import styles from '../assets/style/Login.module.scss';
import { useNavigate } from 'react-router-dom';

// import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  function Sign(){
    navigate('/signup');
  }
  return (
 <>
 <div className={styles.Login_box}>
    <h2 className={styles.login}>UsTime</h2>
    <form className={styles.Login_form}>
        <input type='text' name='UserName' placeholder='Email'></input>
        <input type='password' name='UserPassword' placeholder='password'></input>
        <label for='remember-check' className={styles.checkboxLabel}>
          <input id='remember-check' type='checkbox' className={styles.checkbox}></input>아이디 저장하기
        </label>
        <button type='submit' value='Login' className={styles.Login_button}>Login</button>
        <button type='submit' onClick={Sign} value='SignUp' className={styles.Login_button}> 
          Sign Up
          </button>
    </form>

 </div>
 </>
  );
};

export default Login;