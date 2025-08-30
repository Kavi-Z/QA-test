import React, { useState } from "react";


function QuizForm({ onSubmit, initialQuiz, buttonText }) {
  const [title, setTitle] = useState(initialQuiz?.title || "");
  const [questions, setQuestions] = useState(initialQuiz?.questions || []);

  const [qText, setQText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: qText, options: [...options], correct: Number(correct) },
    ]);
    setQText("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, questions });
    setTitle("");
    setQuestions([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Quiz Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <h4>Add Question</h4>
      <input
        placeholder="Question"
        value={qText}
        onChange={e => setQText(e.target.value)}
      />
      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={e => {
            const newOpts = [...options];
            newOpts[i] = e.target.value;
            setOptions(newOpts);
          }}
        />
      ))}
      <label>
        Correct Option:
        <select value={correct} onChange={e => setCorrect(e.target.value)}>
          {options.map((_, i) => (
            <option key={i} value={i}>{`Option ${i + 1}`}</option>
          ))}
        </select>
      </label>
      <button type="button" onClick={addQuestion}>Add Question</button>
      <ul>
        {questions.map((q, i) => (
          <li key={i}>
            {q.text} (Correct: {q.options[q.correct]})
          </li>
        ))}
      </ul>
      <button type="submit">{buttonText || "Create Quiz"}</button>
    </form>
  );
}

export default QuizForm;