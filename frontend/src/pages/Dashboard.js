import React from 'react';
import './All.css';

import image1 from '../assets/images/houseimg1.jpg';
import image2 from '../assets/images/houseimg2.jpg';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
      </header>
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <p>Welcome to the Dashboard page!</p>

        <div className="dashboard-images">
          <img src={image1} alt="Description for Image 1" className="dashboard-image" />
          <img src={image2} alt="Description for Image 2" className="dashboard-image" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
