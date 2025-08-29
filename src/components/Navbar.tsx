import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">EasyAuktion</Link>
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className={`md:flex items-center space-x-6 ${isOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent`}>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0">
            <Link to="/" className="hover:text-blue-400 transition">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-listings" className="hover:text-blue-400 transition">Mina Annonser</Link>
                <Link to="/create-ad" className="hover:text-blue-400 transition">Skapa Annons</Link>
                <button onClick={handleLogout} className="hover:text-blue-400 transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
                <Link to="/register" className="hover:text-blue-400 transition">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;