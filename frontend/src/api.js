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

export const getQuiz = async (quizId, creatorId) => {
  try {
      const response = await axios.get(`${API_URL}/quizzes/${quizId}`, { params: { creatorId } });
      return response.data;
  } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
  }
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

// Fetch quizzes by username and optionally title
export const getQuizList = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`, { params: { creatorId: username } });
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};


export const getQuizByCreatorAndId = async (quizId, creatorId) => {
  const response = await axios.get(`/api/quizzes/${quizId}?creatorId=${creatorId}`);
  return response;
};

export const updateQuiz = async (quizId, title, questions, creatorId) => {
  const response = await axios.put(`/api/quizzes/${quizId}`, { title, questions, creatorId });
  return response;
};

// New function to fetch quiz by creator ID and title
export const getQuizByTitleAndCreator = async (creatorId, title) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`, {
      params: { creatorId, title }
    });
    return response; // Ensure you return the entire response object
  } catch (error) {
    console.error('Error fetching quiz by title and creator:', error);
    throw error;
  }
};
