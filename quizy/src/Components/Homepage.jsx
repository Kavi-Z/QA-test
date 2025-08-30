import React from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    
    <div className="homepage-container">
      <main className="homepage-main">
        <div className="rect-wrapper">
        
         <header className="homepage-header">
              <p>Quiz Maker</p>
            </header>
            <div className='content_home'> <p >
              Create.Share.Evaluate
              </p>
              <p>
                Build quizzes effortlessly and track results in real-time.
                </p></div>
           
          <div className="content-inside-rect">
           

            <h2>Select Your Role</h2>

            <div className="button-group">
              <button className="teacher-btn" onClick={() => navigate('/login/teacher')}>
                Login as Teacher
              </button>
              <button className="student-btn" onClick={() => navigate('/login/student')}>
                Login as Student
              </button>
            </div>

            <div className="create-account-section">
              <p className="signup-link" onClick={() => navigate('/signup')}>
                Don't have an account?
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
