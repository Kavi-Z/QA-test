import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TakeQuiz.css';

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_QUIZ_APP_BACKEND_URL}/api/quizzes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizData(res.data);
      } catch (err) {
        console.error("Failed to fetch quiz:", err.response?.data || err.message);
        setError("Failed to load quiz. Please try again later.");
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const orderedAnswers = quizData.questions.map((question) => {
      return question.options.indexOf(answers[question._id]);
    });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_QUIZ_APP_BACKEND_URL}/api/quizzes/${id}/submit`, // check
        { answers: orderedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScore(res.data.correctAnswers);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err.response?.data || err.message);
      setError("Failed to submit quiz. Please try again later.");
    }
  };

  if (error) return <div className="TakeQuizContainer">{error}</div>;
  if (!quizData) return <div className="TakeQuizContainer">Loading quiz...</div>;

  if (submitted) {
    return (
      <div className="TakeQuizContainer">
        <h2>{quizData.title}</h2>
        <p>Your Score: {score} / {quizData.questions.length}</p>
        <button onClick={() => navigate("/student/dashboard")}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="TakeQuizContainer">
      <form onSubmit={handleSubmit}>
        <h2>{quizData.title}</h2>
        {quizData.questions.map((question, index) => (
          <div key={question._id}>
            <h4>{index + 1}. {question.questionText}</h4>
            {question.options.map((option, idx) => (
              <label key={idx}>
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={option}
                  checked={answers[question._id] === option}
                  onChange={() => handleOptionChange(question._id, option)}
                  required
                />
                {option}
              </label>
            ))}
          </div>
        ))}
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
}

export default TakeQuiz;
