import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
const Signup = () => {
  const navigate = useNavigate();

  return (
     <div className='Wrapper_signup1'>
    <div className="signup-container">
         <button className="back-arrow" onClick={() => navigate(-1)}></button> 
      <h2>Sign Up</h2>
      <div className="button-group">
        <button className='teacher-btn' onClick={() => navigate('/signup/teacher')}>Sign up as Teacher</button>
        <button className='student-btn' onClick={() => navigate('/signup/student')}>Sign up as Student</button>
      </div>
    </div>
    </div>
  );
};

export default Signup;
