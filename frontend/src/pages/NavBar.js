import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <style>
        {`
          /* Basic Reset */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
          }

          .navbar {
            background-color: #333;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
          }

          .navbar-logo {
            color: white;
            font-size: 24px;
            font-weight: bold;
            text-decoration: none;
          }

          .nav-list {
            list-style: none;
            display: flex;
            margin: 0;
          }

          .nav-item {
            margin: 0 15px;
          }

          .nav-item a {
            color: white;
            text-decoration: none;
            padding: 8px 16px;
            font-size: 16px;
            display: block;
            transition: background-color 0.3s ease;
          }

          .nav-item a:hover {
            background-color: #555;
            border-radius: 4px;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .navbar {
              flex-direction: column;
              padding: 10px 0;
            }

            .nav-list {
              flex-direction: column;
              align-items: center;
              width: 100%;
            }

            .nav-item {
              margin: 10px 0;
            }
          }
        `}
      </style>

      <nav className="navbar">
        <Link to="/" className="navbar-logo">
        House Price Prediction
        </Link>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/house-price">House Price</Link>
          </li>
          <li className="nav-item">
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
