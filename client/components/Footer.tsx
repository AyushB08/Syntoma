
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm mb-4 md:mb-0">
            &copy; 2024 Syntoma. All rights reserved.
          </p>
          <nav>
            <ul className="flex space-x-4">
              
              <li>
                <a href="#" className="text-white hover:text-gray-400 transition-colors duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-400 transition-colors duration-300">
                  Instructions
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-400 transition-colors duration-300">
                  About Us
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;