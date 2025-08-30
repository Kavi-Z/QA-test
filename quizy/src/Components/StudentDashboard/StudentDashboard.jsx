import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './StudentDashboard.css';

function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
    fetchResults();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_QUIZ_APP_BACKEND_URL}/api/quizzes/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(res.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error.response?.data || error.message);
    }
  };

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_QUIZ_APP_BACKEND_URL}/api/quizzes/my-results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (error) {
      console.error("Error fetching results:", error.response?.data || error.message);
    }
  };

  return (
    <div className="StudentDashboardContainer">
       <button className="back-arrow" onClick={() => navigate('/')}></button>
      <h2>Student Dashboard</h2>
      <div className="quiz-list">
        {quizzes.map((quiz) => {
          const result = results.find((r) => r.quiz._id === quiz._id);
          return (
            <div key={quiz._id} className="quiz-card">
              <b>{quiz.title}</b>
              <button onClick={() => navigate(`/quiz/${quiz._id}`)}>Take Quiz</button>
              {result && (
                <span>Score: {result.score} / {result.totalQuestions}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudentDashboard;
