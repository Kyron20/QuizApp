import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizList, getQuizByCreatorAndId, updateQuiz } from '../api';

function EditQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [creatorId, setCreatorId] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const navigate = useNavigate();
  const { quizId } = useParams();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const storedCreatorId = localStorage.getItem('creatorId');
      console.log('Stored Creator ID:', storedCreatorId);
      setCreatorId(storedCreatorId);
      if (!storedCreatorId) {
        alert('Creator ID not found');
        return;
      }

      try {
        const response = await getQuizList(storedCreatorId);
        setQuizzes(response.data);
      } catch (error) {
        console.error(error);
        alert('Error fetching quizzes');
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (quizId && creatorId) {
      const fetchQuiz = async () => {
        try {
          const response = await getQuizByCreatorAndId(quizId, creatorId);
          const quiz = response.data;
          setTitle(quiz.title);
          setQuestions(quiz.questions);
        } catch (error) {
          console.error(error);
          alert('Error fetching quiz data');
        }
      };

      fetchQuiz();
    }
  }, [quizId, creatorId]);

  const handleEditClick = (quizId) => {
    setSelectedQuiz(quizId);
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
      await updateQuiz(selectedQuiz, title, questions, creatorId);
      alert('Quiz updated successfully');
      setSelectedQuiz(null);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error updating quiz');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Your Quizzes</h2>

      {!selectedQuiz && !quizId && (
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Your Quizzes</h2>
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="flex justify-between items-center mb-4">
              <h3 className="font-bold">{quiz.title}</h3>
              <button
                onClick={() => handleEditClick(quiz._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </button>
            </div>
          ))}
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
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Another Question
              </button>
            </div>
          ))}
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