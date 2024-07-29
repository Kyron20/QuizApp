import React, { useEffect, useState } from 'react';
import { getQuizList, getQuiz } from '../api';

function QuizList({ user }) {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (user && user.username) {
                try {
                    const response = await getQuizList(user.username); // Ensure this passes the username correctly
                    console.log('Fetched quizzes:', response); 
                    setQuizzes(response);
                } catch (error) {
                    console.error('Error fetching quizzes:', error);
                    setQuizzes([]);
                }
            }
        };

        fetchQuizzes();
    }, [user]);

    const handleQuizClick = async (quizId) => {
        try {
            const response = await getQuiz(quizId, user.username); 
            setSelectedQuiz(response);
            setUserAnswers(Array(response.questions.length).fill(''));
            setScore(null);
        } catch (error) {
            console.error('Error fetching quiz:', error);
        }
    };

    const handleAnswerChange = (index, value) => {
        const newUserAnswers = [...userAnswers];
        newUserAnswers[index] = value;
        setUserAnswers(newUserAnswers);
    };

    const handleQuizSubmit = (e) => {
        e.preventDefault();
        if (selectedQuiz) {
            let newScore = 0;
            selectedQuiz.questions.forEach((q, index) => {
                if (q.correctAnswer === userAnswers[index]) {
                    newScore++;
                }
            });
            setScore(newScore);
        }
    };

    const handleBackToHome = () => {
        setSelectedQuiz(null);
        setUserAnswers([]);
        setScore(null);
    };

    return (
        <div className="p-4">
            {!selectedQuiz ? (
                <>
                    <h2 className="text-2xl font-bold mb-6">Your Quizzes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {quizzes.map((quiz) => (
                            <div
                                key={quiz._id}
                                className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 transition flex flex-col justify-between"
                                onClick={() => handleQuizClick(quiz._id)}
                            >
                                <h3 className="font-bold mb-2">{quiz.title}</h3>
                                <p className="text-gray-600 text-sm">Created by: {quiz.creatorId}</p>
                                <p className="text-gray-500 text-sm">Questions: {quiz.questions.length}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">{selectedQuiz.title}</h3>
                        <form onSubmit={handleQuizSubmit}>
                            {selectedQuiz.questions.map((q, index) => (
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
                                    Your score: {score} / {selectedQuiz.questions.length}
                                </h3>
                                <button
                                    onClick={handleBackToHome}
                                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Back to Home Page
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizList;
