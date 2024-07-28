// src/components/QuizList.js
import React, { useEffect, useState } from 'react';
import { getQuizList } from '../api'; // You'll need to implement this endpoint in your backend

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getQuizList();
        setQuizzes(response.data);
      } catch (error) {
        console.error(error);
        //alert('Error retrieving quizzes'); //might have to get rid of this later its annoying.
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <h2>Quiz List</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>
            <h3>{quiz.title}</h3>
            <p>Created by: {quiz.creatorId}</p>
            <p>Questions: {quiz.questions.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizList;
