import React from 'react';
import styles from '../../assets/style/Common/Loading.module.scss';

function Loading() {
  return (
    <div className={styles.loaderContainer}>
      <span className={styles.loader}></span>
    </div>
  );
}

export default Loading;