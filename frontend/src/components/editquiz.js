import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizList, getQuizByCreatorAndId, updateQuiz } from '../api';

function EditQuiz({ user }) {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const navigate = useNavigate();
  const { quizId } = useParams();

  // Fetch quizzes if user is available
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (user && user.username) {
        try {
          const response = await getQuizList(user.username);
          setQuizzes(response);
        } catch (error) {
          console.error('Error fetching quizzes:', error);
          setQuizzes([]);
        }
      } else {
        console.log('No user or user.username found');
      }
    };

    fetchQuizzes();
  }, [user]);

  // Fetch quiz details if quizId and user are available
  useEffect(() => {
    if (quizId && user && user.username) {
      const fetchQuiz = async () => {
        try {
          const response = await getQuizByCreatorAndId(quizId, user.username);
          const quiz = response.data;
          setTitle(quiz.title);
          setQuestions(quiz.questions);
          setSelectedQuiz(quizId);
        } catch (error) {
          console.error('Error fetching quiz data:', error);
        }
      };

      fetchQuiz();
    } else {
      console.log('No quizId or user or user.username found');
    }
  }, [quizId, user]);

  const handleEditClick = (quizId) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
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
      await updateQuiz(selectedQuiz, { title, questions, creatorId: user.username });
      alert('Quiz updated successfully');
      navigate('/edit-quiz');
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Your Quizzes</h2>

      {!selectedQuiz && (
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Your Quizzes</h2>
          {quizzes.length === 0 ? (
            <p>No quizzes found.</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz._id} className="flex justify-between items-center mb-4">
                <h3 className="font-bold">{quiz.title}</h3>
                <button
                  onClick={() => handleEditClick(quiz._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {selectedQuiz && (
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {questions.map((q, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                name="question"
                placeholder={`Question ${index + 1}`}
                value={q.question}
                onChange={(e) => handleQuestionChange(index, e)}
                required
                className="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {q.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  required
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
              <input
                type="text"
                name="correctAnswer"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(index, e)}
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          >
            Add Another Question
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Quiz
          </button>
        </form>
      )}
    </div>
  );
}

export default EditQuiz;
