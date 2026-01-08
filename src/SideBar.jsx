import './DashBoard/Dashboard.css'
import './App.css'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScaleBalanced,  faPercentage, faUpload, faBook, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faDashboard, faNoteSticky, faScaleUnbalanced, faGamepad, faGear, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

function SideBar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear security tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return(
    <>
      <sidebar className="leftSide">
        <div className="insideContent">
          <div className="sbarCenter">
            <div className="sBarHeader">
              <FontAwesomeIcon icon={faScaleBalanced} className="anchor"/>
              L.P.L.V.M.
            </div>
          </div>
          <div className="navComponents">
            <div className="navTitle">
              <div>
                Navigation
              </div>
              <div>
                <FontAwesomeIcon icon={faAngleLeft} className="navlinkIcon"/>
              </div>
            </div>
            <div className="navLinks">
              <Link to="/dashboard">
                <div className="dashboard">
                  <FontAwesomeIcon icon={faDashboard} className="navIcons"/>Dashboard
                </div>
              </Link>
              <Link to="/lessons">
                <div className="components">
                  <FontAwesomeIcon icon={faNoteSticky} className="navIcons"/>Lessons
                </div>
              </Link>
              <Link to="/quiz">
                <div className="quizzes">
                  <FontAwesomeIcon icon={faScaleUnbalanced} className="navIcons"/>Quizzes
                </div>
              </Link>
              <Link to="/profile">
                <div className="settings">
                  <FontAwesomeIcon icon={faGear} className="navIcons"/>Profile
                </div>
              </Link>
            </div>
            <button onClick={handleLogout} className="logout">Log Out</button>
          </div>
        </div>
      </sidebar>
    </>
  )
}
export default SideBar;