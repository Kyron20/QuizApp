import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header({ user, onLogout, onResetUI }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout(); // Call the provided logout function
    localStorage.removeItem('token'); // Remove token from local storage
    localStorage.removeItem('username'); // Remove username from local storage
    navigate('/login'); // Redirect to login page
  };

  const handleHomePageClick = () => {
    if (onResetUI && typeof onResetUI === 'function') {
      onResetUI(); // Trigger the reset UI function
    }
    navigate('/'); // Navigate to the home page
  };

  // Determine if the current path is a login or signup page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Conditionally render "Home Page" button */}
        {!isAuthPage && (
          <button onClick={handleHomePageClick} className="text-white text-lg font-semibold">Home Page</button>
        )}
        <div className="space-x-4">
          {!user ? (
            <>
              <Link to="/signup" className="text-white hover:text-gray-300">SignUp</Link>
              <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            </>
          ) : (
            <>
              <span className="text-white">Welcome {user.username}!</span>
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
