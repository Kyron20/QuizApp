import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_URL}/quizzes`, quizData);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : error.message);
  }
};

export const getQuiz = (quizId) => {
  return axios.get(`${API_URL}/quizzes/${quizId}`);
};

export const getQuizByTitle = async (title) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`, { params: { title } });
    return response; // Ensure you return the entire response object
  } catch (error) {
    console.error('Error fetching quiz by title:', error);
    throw error;
  }
};

export const updateQuiz = (quizId, title, questions) => {
  return axios.put(`${API_URL}/quizzes/${quizId}`, { title, questions });
};

export const getQuizList = (creatorId) => {
  return axios.get(`${API_URL}/quizzes`, { params: { creatorId } });
};

// New function to fetch quiz by creator ID and title
export const getQuizByTitleAndCreator = async (creatorId, title) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`, { params: { creatorId, title } });
    return response; // Ensure you return the entire response object
  } catch (error) {
    console.error('Error fetching quiz by title and creator:', error);
    throw error;
  }
};
