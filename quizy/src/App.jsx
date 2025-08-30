import React, { useState } from "react";
import TeacherLogin from "./Components/TeacherLogin/TeacherLogin";
import TeacherDashboard from "./Components/TeacherDashboard";
import StudentLogin from "./Components/StudentLogin";
import StudentDashboard from "./Components/StudentDashboard";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <div>
        <h1>Quizy</h1>
        <TeacherLogin onLogin={u => setUser({ ...u, role: "teacher" })} />
        <StudentLogin onLogin={u => setUser({ ...u, role: "student" })} />
      </div>
    );
  }

  if (user.role === "teacher") {
    return <TeacherDashboard teacher={user} />;
  }
  if (user.role === "student") {
    return <StudentDashboard student={user} />;
  }
  return null;
}

export default App;