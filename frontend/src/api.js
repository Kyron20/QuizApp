import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createQuiz = async (quizData) => {
  try {
      const response = await axios.post('http://localhost:5000/api/quizzes', quizData, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Failed to create quiz');
  }
};

export const getQuiz = (quizId) => {
  return axios.get(`${API_URL}/quizzes/${quizId}`);
};

export const updateQuiz = (quizId, title, questions) => {
  return axios.put(`${API_URL}/quizzes/${quizId}`, { title, questions });
};

export const getQuizList = () => {
  return axios.get(`${API_URL}/quizzes`);
};
