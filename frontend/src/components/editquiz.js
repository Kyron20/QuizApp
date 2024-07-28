// src/components/EditQuiz.js
import React, { useState, useEffect } from 'react';
import { getQuiz, updateQuiz } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

function EditQuiz() {
  const { quizId } = useParams(); // Get quiz ID from URL params
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    // Fetch the quiz data when component mounts
    const fetchQuiz = async () => {
      try {
        const response = await getQuiz(quizId);
        const quiz = response.data;
        setTitle(quiz.title);
        setQuestions(quiz.questions);
      } catch (error) {
        console.error(error);
        alert('Error fetching quiz data');
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateQuiz(quizId, title, questions);
      alert('Quiz updated successfully');
      navigate('/'); // Redirect to home or quiz list after successful update
    } catch (error) {
      console.error(error);
      alert('Error updating quiz');
    }
  };

  return (
    <div>
      <h2>Edit Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {questions.map((q, index) => (
          <div key={index}>
            <input
              type="text"
              name="question"
              placeholder={`Question ${index + 1}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(index, e)}
              required
            />
            {q.options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                placeholder={`Option ${optionIndex + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                required
              />
            ))}
            <input
              type="text"
              name="answer"
              placeholder="Correct Answer"
              value={q.answer}
              onChange={(e) => handleQuestionChange(index, e)}
              required
            />
            <button type="button" onClick={handleAddQuestion}>Add Another Question</button>
          </div>
        ))}
        <button type="submit">Update Quiz</button>
      </form>
    </div>
  );
}

export default EditQuiz;
