import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from './components/header';
import Login from './components/login';
import CreateQuiz from './components/createquiz';
import JoinQuiz from './components/joinquiz';
import EditQuiz from './components/editquiz';
import QuizList from './components/quizlist';
import SignUp from './components/signup';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { username, email } = decodedToken;
        setUser({ username, email });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<QuizList user={user} />} />
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/create-quiz" element={<CreateQuiz user={user} />} />
          <Route path="/join-quiz" element={<JoinQuiz />} />
          <Route path="/edit-quiz/:quizId" element={<EditQuiz />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
