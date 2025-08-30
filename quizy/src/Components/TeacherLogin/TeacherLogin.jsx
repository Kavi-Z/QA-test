import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherLogin.css";
function TeacherLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
      role: "teacher",  
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_QUIZ_APP_BACKEND_URL}/api/auth/login`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        
        localStorage.setItem("token", data.token);
        navigate("/teacher/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };
return (
  <div className="teacher-login-container">
  <button className="back-arrow" onClick={() => navigate(-1)}></button>
  <h2>Teacher Login</h2>
  <form className="teacher-login-form" onSubmit={handleSubmit}>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <button type="submit">Login as Teacher</button>
    {error && <p className="teacher-login-error">{error}</p>}
  </form>
</div>

);

}

export default TeacherLogin;
