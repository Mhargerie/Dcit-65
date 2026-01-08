import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login.jsx'
import Register from './Register.jsx'
import DashBoard from './Dashboard/Dashboard.jsx';
import Quiz from './Quiz/QuizPage.jsx';
import Courses from './Courses/Courses.jsx';
import Profile from './Profiles/Profile.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import Lessons from './Lessons/Lessons.jsx';
import LessonView from './Lessons/LessonView.jsx';

function App() {
  return (
    <>
      <div className="mainContent">
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashBoard />
                </PrivateRoute>
              } />
              <Route path="/lessons" element={<PrivateRoute><Lessons /></PrivateRoute>} />
              <Route path="/lessons/:id" element={<PrivateRoute><LessonView /></PrivateRoute>} />
            <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
            <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App;
