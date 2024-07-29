import React, { useState } from 'react';
import { getQuizByTitleAndCreator } from '../api';
import { useNavigate } from 'react-router-dom';

function JoinQuiz() {
  const [creatorID, setCreatorID] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [quizNotFound, setQuizNotFound] = useState(false);

  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const fetchQuiz = async (creator, title) => {
    setQuizNotFound(false);
    setScore(null);
    try {
      const response = await getQuizByTitleAndCreator(creator, title);
      console.log('API Response:', response);

      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const quizData = response.data[0];
        setQuiz(quizData);
        setUserAnswers(Array(quizData.questions.length).fill(''));
      } else {
        setQuiz(null);
        setQuizNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setQuiz(null);
      setQuizNotFound(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'creatorID') {
      setCreatorID(value);
    } else if (name === 'quizTitle') {
      setQuizTitle(value);
    }
  };

  const handleQuizSearch = (e) => {
    e.preventDefault();
    if (creatorID && quizTitle) {
      fetchQuiz(creatorID, quizTitle);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[index] = value;
    setUserAnswers(newUserAnswers);
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (quiz) {
      let newScore = 0;
      quiz.questions.forEach((q, index) => {
        if (q.correctAnswer === userAnswers[index]) {
          newScore++;
        }
      });
      setScore(newScore);
    }
  };

  const handleBackToHomepage = () => {
    navigate('/'); // Redirect to homepage
    setQuiz(null); // Reset quiz state
    setUserAnswers([]);
    setScore(null);
    setQuizNotFound(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Join Quiz</h2>
      <form onSubmit={handleQuizSearch} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Creator ID</label>
          <input
            type="text"
            name="creatorID"
            placeholder="Enter Creator ID"
            value={creatorID}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Quiz Title</label>
          <input
            type="text"
            name="quizTitle"
            placeholder="Enter Quiz Title"
            value={quizTitle}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Search Quiz
        </button>
      </form>

      {quizNotFound && (
        <div className="text-red-500 font-bold mb-4">
          Quiz doesn't exist
        </div>
      )}

      {quiz && quiz.questions && Array.isArray(quiz.questions) && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">{quiz.title}</h3>
          <form onSubmit={handleQuizSubmit}>
            {quiz.questions.map((q, index) => (
              <div key={index} className="mb-6">
                <strong>{q.question}</strong>
                <div>
                  {q.options.map((option, i) => (
                    <label key={i} className="block mt-2">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={userAnswers[index] === option}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit Quiz
            </button>
          </form>
          {score !== null && (
            <div className="mt-4">
              <h3 className="text-2xl font-bold">
                Your score: {score} / {quiz.questions.length}
              </h3>
              <button
                onClick={handleBackToHomepage}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Back to Home page
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JoinQuiz;
