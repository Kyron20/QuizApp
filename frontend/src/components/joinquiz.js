// src/components/JoinQuiz.js
import React, { useState } from 'react';
import { getQuiz } from '../api';

function JoinQuiz() {
  const [quizId, setQuizId] = useState('');
  const [quiz, setQuiz] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await getQuiz(quizId);
      setQuiz(response.data);
    } catch (error) {
      console.error(error);
      alert('Error retrieving quiz');
    }
  };

  return (
    <div>
      <h2>Join Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          required
        />
        <button type="submit">Join Quiz</button>
      </form>
      {quiz && (
        <div>
          <h3>{quiz.title}</h3>
          <ul>
            {quiz.questions.map((q, index) => (
              <li key={index}>
                <strong>{q.question}</strong>
                <ul>
                  {q.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default JoinQuiz;
