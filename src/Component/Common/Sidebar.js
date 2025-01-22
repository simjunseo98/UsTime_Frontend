import { useNavigate, NavLink } from "react-router-dom";
import styles from "../../assets/style/Common/Sidebar.module.scss";
import defaultProfilePicture from "../../assets/img/이미지 없음.jpg";


const Sidebar = ({ isOpen, onClose }) => {
  // 로그아웃
  const navigate = useNavigate();
  const name = sessionStorage.getItem("name");
  const email = sessionStorage.getItem("email");
  const profileUrl = sessionStorage.getItem("profileUrl") || defaultProfilePicture;

  // 로그아웃 로직
  const handleLogout = () => {
    sessionStorage.clear()
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <div className={`${styles.SidebarContainer} ${isOpen ? styles.open : styles.closed}`}>
      <button className={styles.closeButton} onClick={onClose}>X</button>

      {/* 프로필 섹션 */}
      <div className={styles.profileSection}>
        <img
          src={ profileUrl }
          alt="프로필 사진"
          className={styles.profilePicture}
        />
        <div className={styles.profileText}>
          <p className={styles.profileName}>{name}</p>
          <p className={styles.profileEmail}>{email}</p>
        </div>
      </div>

      {/* 메뉴 섹션 */}
      <ul className={styles.menuSection}>
        <NavLink to="/myprofile" className={styles.SidebarNav} aria-current="page">
          <li>프로필 관리</li>
        </NavLink>
        <NavLink to="/changePassword" className={styles.SidebarNav} aria-current="page">
          <li>비밀번호 변경</li>
        </NavLink>
        <NavLink to="/couple" className={styles.SidebarNav} aria-current="page">
          <li>My Couple</li>
        </NavLink>
        <NavLink to="/picture" className={styles.SidebarNav} aria-current="page">
          <li>사진첩</li>
        </NavLink>
        <button className={styles.SidebarNav} onClick={handleLogout}>로그아웃</button>
      </ul>
    </div>
  );
};

export default Sidebar;
