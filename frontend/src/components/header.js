import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Call the provided logout function
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-semibold">Home</Link>
        <div className="space-x-4">
          {!user ? (
            <>
              <Link to="/signup" className="text-white hover:text-gray-300">SignUp</Link>
              <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            </>
          ) : (
            <>
              <span className="text-white">Welcome!</span>
              <button onClick={handleLogout} className="text-white hover:text-gray-300">Logout</button>
              <Link to="/create-quiz" className="text-white hover:text-gray-300">Create Quiz</Link>
              <Link to="/join-quiz" className="text-white hover:text-gray-300">Join Quiz</Link>
              <Link to="/edit-quiz" className="text-white hover:text-gray-300">Edit Quiz</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
