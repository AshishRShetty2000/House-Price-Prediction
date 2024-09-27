import React from 'react';
import './All.css';

const About = () => {
  return (
      <div className="about">
        <h2>About This Website</h2>
        <p>
          This website predicts the house price based on selected features.
          Users can select various features, and the machine learning model, trained on specific data,
          will predict the house price accordingly.
        </p>
      </div>
  );
}

export default About;
