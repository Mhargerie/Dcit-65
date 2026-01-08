import './Dashboard.css'
import './../App.css'
import { useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHand, faBarChart, faLineChart, faCalendar, faFire } from '@fortawesome/free-solid-svg-icons'
import DashCard from './DashCard'
import DashBarChartA from '../Graphs/DashBarChartA'
import DashBarChartB from '../Graphs/DashBarChartB'
import SideBar from './../SideBar.jsx'
function DashBoard() {
  const [params, setParams] = useSearchParams();
  // Read logged-in user from localStorage (saved by Login)
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('user')) || null;
  } catch (e) {
    storedUser = null;
  }
  const displayName = (storedUser && (storedUser.full_name || storedUser.username)) || 'Aljon';
  const chartType = params.get("chartType") || "daily";
  return(
    <>
      <SideBar />
      <main className="center">
          <div className="centerContent">
            {/* Start Header contents */}
            <div className="headerClass">
              <div className="nameClass">Hello, {displayName}!
                <FontAwesomeIcon icon={faHand} className="handWave"/>
              </div>
              <div className="inputText">
                <input type="text" name="search" id="" placeholder='Search here'/>
              </div>
            </div>
            {/* End Header contents */}
            <div className="subTitle">
              Let's learn something new today!
            </div>
            {/* Start Overview Content here */}
            <div className="overViewClass">
              <div className="nameClass">Overview</div>
              <div className="statusCard">
                <DashCard classname="inProgress" title="Courses in Progress" 
                value="18" recent="3 in the past week" icons={faBarChart} />
                <DashCard classname="completed" title="Courses Completed" 
                value="4" recent="Last topic 75% complete" icons={faLineChart} />
                <DashCard classname="loginDays" title="Days since Day 1" 
                value="75" recent="3 Days Log in last week" icons={faCalendar} />
                <DashCard classname="streak" title="Streak Progress" 
                value="100" recent="Level V Streak" icons={faFire} />
              </div>
            </div>
            {/* End Overview Content here */}
            <div className="graphs">
              <div className="activeHours">
                <div className="activeHeader">
                  <div className="nameClass">Active Hours</div>
                  <select name="options" id="" value={chartType} onChange={(e) => setParams({ chartType: e.target.value })}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="dashbarchart">
                  {chartType == "daily" && <DashBarChartA />}
                  {chartType == "weekly" && <DashBarChartB />}
                </div>
              </div>
              <div className="performance">
                <div className="nameClass">Performance Summary</div>
              </div>
            </div>
            <div className="recentLessons">
              <div className="nameClass">My Assigments</div>
              <div className="listContainer">
                <div className="listContent">
                  
                </div>
              </div>
            </div>
          </div>
        </main>
    </>
  )
}
export default DashBoard;