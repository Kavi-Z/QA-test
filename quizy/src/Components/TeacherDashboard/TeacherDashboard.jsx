import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import './TeacherDashboard.css';

function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [expandedQuizIds, setExpandedQuizIds] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    questions: [],
  });
  const [editingQuizId, setEditingQuizId] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_QUIZ_APP_BACKEND_URL}/api/quizzes/my-quizzes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error.response?.data || error.message);
    }
  };

  const toggleQuizView = (quizId) => {
    setExpandedQuizIds((prev) =>
      prev.includes(quizId) ? prev.filter((id) => id !== quizId) : [...prev, quizId]
    );
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingQuizId) {
         await axios.put(
      `${process.env.REACT_APP_QUIZ_APP_BACKEND_URL}/api/quizzes/${editingQuizId}`,
      newQuiz, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(
      `${process.env.REACT_APP_QUIZ_APP_BACKEND_URL}/api/quizzes`,
      newQuiz, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setNewQuiz({ title: '', description: '', questions: [] });
      setShowCreateForm(false);
      setEditingQuizId(null);
      fetchQuizzes();
    } catch (err) {
      console.error("Quiz operation failed:", err.response?.data || err.message);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this quiz?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(
  `${process.env.REACT_APP_QUIZ_APP_BACKEND_URL}/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (err) {
      console.error("Delete quiz failed:", err.response?.data || err.message);
    }
  };

  const handleAddQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [
        ...newQuiz.questions,
        {
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: ''
        }
      ]
    });
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions.splice(index, 1);
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleEditQuiz = (quiz) => {
    setNewQuiz({
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
    });
    setEditingQuizId(quiz._id);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 
  const handleLeaderboard = (quizId) => {
    navigate(`/leaderboard/${quizId}`);
  };

  return (
    <div className="DashboardContainer">
         <button className="back-arrow" onClick={() => navigate('/')}></button> 
    <div className="dashboard" style={{ padding: "20px" }}>
      <h1>Teacher Dashboard</h1>
      <h2>Your Quizzes</h2>

      <button
        onClick={() => {
          setShowCreateForm(!showCreateForm);
          setEditingQuizId(null);
          setNewQuiz({ title: '', description: '', questions: [] });
        }}
        style={{ marginBottom: "20px" }}
      >
        {showCreateForm ? "Cancel" : "Create New Quiz"}
      </button>

      {showCreateForm && (
        <form onSubmit={handleCreateQuiz} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Quiz Title"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            required
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            type="text"
            placeholder="Quiz Description"
            value={newQuiz.description}
            onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
            required
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button type="button" onClick={handleAddQuestion} style={{ margin: '10px 0' }}>
            Add Question
          </button>

          {newQuiz.questions.map((q, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Question Text"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                required
                style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
              />
              {q.options.map((opt, optIdx) => (
                <input
                  key={optIdx}
                  type="text"
                  placeholder={`Option ${optIdx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const updatedOptions = [...q.options];
                    updatedOptions[optIdx] = e.target.value;
                    handleQuestionChange(index, 'options', updatedOptions);
                  }}
                  required
                  style={{ marginRight: '10px', marginBottom: '5px', padding: '5px' }}
                />
              ))}
              <input
                type="text"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                required
                style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
              />
              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  alignContent: "center"
                }}
              >
                Remove Question
              </button>
            </div>
          ))}

          <button type="submit" style={{ padding: '8px 16px' }}>
            {editingQuizId ? 'Update Quiz' : 'Submit Quiz'}
          </button>
        </form>
      )}

      {quizzes.length === 0 ? (
        <p>No quizzes created yet.</p>
      ) : (
        quizzes.map((quiz) => (
          <div
            key={quiz._id}
            style={{
              border: "1px solid #ccc",
    color: "white",
    backgroundColor: "transparent",
    margin: "20px auto",    
    padding: "10px",
    borderRadius: "8px",
    width: "100%",
    position: "relative",
    textAlign: "left"

            }}
          >
            <h3 onClick={() => toggleQuizView(quiz._id)} style={{ cursor: "pointer" }}>{quiz.title}</h3>
            <p>{quiz.description}</p>

            <div className="btns"  style={{ position: "absolute", top: "10px", right: "10px" }}>
              <button
                onClick={() => handleEditQuiz(quiz)}
                style={{
                  marginRight: "10px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "4px"
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteQuiz(quiz._id)}
                style={{
                  marginRight: "10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "4px"
                }}
              >
                Delete
              </button>
             
              <button
                onClick={() => handleLeaderboard(quiz._id)}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "4px"
                }}
              >
                Leaderboard
              </button>
            </div>

            {expandedQuizIds.includes(quiz._id) && (
              <>
                <p><strong>Total Questions:</strong> {quiz.questions.length}</p>
                {quiz.questions.map((q, index) => (
                  <div key={index} style={{ marginTop: "10px", paddingLeft: "10px" }}>
                    <p><strong>Q{index + 1}:</strong> {q.questionText}</p>
                    <ul>
                      {q.options.map((option, optIdx) => (
                        <li key={optIdx}>{option}</li>
                      ))}
                    </ul>
                    <p style={{ color: "#4CAF50" }}>
                      <strong>Correct Answer:</strong> {q.correctAnswer}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        ))
      )}
    </div>
    </div>
  );
}

export default TeacherDashboard;
