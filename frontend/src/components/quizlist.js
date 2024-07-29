import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizList } from '../api';

function QuizList({ user }) {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (user && user.username) {
                try {
                    const response = await getQuizList(user.username);
                    console.log('Fetched quizzes:', response.data); // Log the response
                    // Ensure the response data is always an array
                    const data = Array.isArray(response.data) ? response.data : [response.data];
                    setQuizzes(data);
                } catch (error) {
                    console.error('Error fetching quizzes:', error);
                    setQuizzes([]);
                }
            }
        };

        fetchQuizzes();
    }, [user]);

    const handleQuizClick = (title) => {
        navigate(`/join-quiz?title=${encodeURIComponent(title)}`);
    };

    // Calculate font size dynamically
    const calculateFontSize = (element) => {
        if (!element) return '1rem'; // Default font size

        const maxWidth = element.clientWidth;
        const minFontSize = 0.75; // Minimum font size in rem
        let fontSize = 1.5; // Default font size in rem

        // Adjust the font size based on the container's width
        while (element.scrollWidth > maxWidth && fontSize > minFontSize) {
            fontSize -= 0.05;
            element.style.fontSize = `${fontSize}rem`;
        }
        return `${fontSize}rem`;
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Your Quizzes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 transition flex flex-col justify-between"
                        onClick={() => handleQuizClick(quiz.title)}
                    >
                        <h3
                            className="font-bold mb-2 flex-grow"
                            ref={(el) => {
                                if (el) {
                                    el.style.fontSize = calculateFontSize(el);
                                }
                            }}
                        >
                            {quiz.title}
                        </h3>
                        <p className="text-gray-600 text-sm">Created by: {quiz.creatorId}</p>
                        <p className="text-gray-500 text-sm">Questions: {quiz.questions.length}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuizList;
