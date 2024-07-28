import React, { useState } from 'react';
import { createQuiz } from '../api';

function CreateQuiz({ user }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);

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

  const handleDeleteQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const creatorId = user?.email || 'Unknown';
      const quizData = { title, creatorId, questions };
      console.log('Sending data:', quizData);
      await createQuiz(quizData);
      alert('Quiz created successfully');
    } catch (error) {
      console.error('Error creating quiz:', error.response ? error.response.data : error.message);
      alert('Error creating quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Create Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <label className="block text-lg font-semibold mb-2">Quiz Title</label>
          <input
            type="text"
            placeholder="Enter Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {questions.map((q, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white relative">
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Question {index + 1}</label>
              <input
                type="text"
                name="question"
                placeholder={`Enter Question ${index + 1}`}
                value={q.question}
                onChange={(e) => handleQuestionChange(index, e)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {q.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-4">
                <label className="block text-lg font-semibold mb-2">Option {optionIndex + 1}</label>
                <input
                  type="text"
                  placeholder={`Enter Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Correct Answer</label>
              <input
                type="text"
                name="correctAnswer"
                placeholder="Enter Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(index, e)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {questions.length > 1 && index > 0 && (
              <button
                type="button"
                onClick={() => handleDeleteQuestion(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Another Question
            </button>
          </div>
        ))}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
