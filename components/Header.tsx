
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-gray-800 p-4 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-green-400 mb-4 sm:mb-0">
          <Link to="/" className="hover:text-green-300 transition-colors">
            {title}
          </Link>
        </h1>
        <nav>
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 text-gray-300">
            <li>
              <Link to="/" className="hover:text-white hover:underline transition-colors text-lg">
                Counter
              </Link>
            </li>
            <li>
              <Link to="/custom-dhikr" className="hover:text-white hover:underline transition-colors text-lg">
                Custom Dhikr
              </Link>
            </li>
            <li>
              <Link to="/adhkar" className="hover:text-white hover:underline transition-colors text-lg">
                Daily Adhkar
              </Link>
            </li>
            <li>
              <Link to="/stats" className="hover:text-white hover:underline transition-colors text-lg">
                Statistics
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
