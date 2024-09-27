// ****currect using ui for 14 features ****************
import React, { useState } from 'react';
import './All.css';
import { FaBuilding, FaChartArea, FaCalendarAlt, FaHome, FaRulerCombined, FaWarehouse, FaCar } from 'react-icons/fa'; // Importing icons

function Houseprice() {
  const [formData, setFormData] = useState({
    MasVnrArea: '', // Masonry veneer area in square feet
    SaleType_WD: '', // Warranty Deed
    OverallQual: '', // Overall Quality (1-10)
    OverallCond: '', // Overall Condition (1-10)
    ExterQual_Gd: '', // Exterior Quality (Good)
    ExterCond_Fa: '', // Exterior Condition (Fair)
    BsmtUnfSF: '', // Unfinished Basement Area
    BsmtFinType1_LwQ: '', // Low-quality finished basement
    LotArea: '', // Lot area in square feet
    YearBuilt: '', // Year Built
    BsmtFinSF1: '', // Finished Basement Area
    TotRmsAbvGrd: '', // Total Rooms Above Ground
    GarageCars: '', // Number of Garage Cars
    GarageArea: '', // Garage Area in square feet
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form data change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:8000/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setPrediction(result.prediction);
      setError('');
    } catch (err) {
      setError('Error fetching prediction');
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-content">
        <h1 className="center-content">House Price Prediction</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <FaBuilding /> Masonry Veneer Area (in sq ft):
            <input 
              type="number" 
              name="MasVnrArea" 
              value={formData.MasVnrArea} 
              onChange={handleChange} 
              placeholder="e.g., 0 to 1600"
              min="0" 
              required 
            />
          </label>
          <br />
          <label>
            <FaHome /> Sale Type :
            <input 
              type="number" 
              name="SaleType_WD" 
              value={formData.SaleType_WD} 
              onChange={handleChange} 
              placeholder="1 for Warranty Deed, 0 for others"
              min="0" max="1"
              required 
            />
          </label>
          <br />
          <label>
            <FaChartArea /> Overall Quality (1-10):
            <input 
              type="number" 
              name="OverallQual" 
              value={formData.OverallQual} 
              onChange={handleChange} 
              placeholder="e.g., 7"
              min="1" max="10"
              required 
            />
          </label>
          <br />
          <label>
            <FaChartArea /> Overall Condition (1-10):
            <input 
              type="number" 
              name="OverallCond" 
              value={formData.OverallCond} 
              onChange={handleChange} 
              placeholder="e.g., 5"
              min="1" max="10"
              required 
            />
          </label>
          <br />
          <label>
            <FaChartArea /> Exterior Quality :
            <input 
              type="number" 
              name="ExterQual_Gd" 
              value={formData.ExterQual_Gd} 
              onChange={handleChange} 
              placeholder="1 for Good, 0 for others"
              min="0" max="1"
              required 
            />
          </label>
          <br />
          <label>
            <FaChartArea /> Exterior Condition :
            <input 
              type="number" 
              name="ExterCond_Fa" 
              value={formData.ExterCond_Fa} 
              onChange={handleChange} 
              placeholder="1 for Fair, 0 for others"
              min="0" max="1"
              required 
            />
          </label>
          <br />
          <label>
            <FaWarehouse /> Unfinished Basement Area (in sq ft):
            <input 
              type="number" 
              name="BsmtUnfSF" 
              value={formData.BsmtUnfSF} 
              onChange={handleChange} 
              placeholder="e.g., 0 to 2000"
              min="0" 
              required 
            />
          </label>
          <br />
          <label>
            <FaWarehouse /> Low-quality Finished Basement :
            <input 
              type="number" 
              name="BsmtFinType1_LwQ" 
              value={formData.BsmtFinType1_LwQ} 
              onChange={handleChange} 
              placeholder="1 for LwQ, 0 for others"
              min="0" max="1"
              required 
            />
          </label>
          <br />
          <label>
            <FaRulerCombined /> Lot Area (in sq ft):
            <input 
              type="number" 
              name="LotArea" 
              value={formData.LotArea} 
              onChange={handleChange} 
              placeholder="e.g., 1300 to 215000"
              min="0"
              required 
            />
          </label>
          <br />
          <label>
            <FaCalendarAlt /> Year Built:
            <input 
              type="number" 
              name="YearBuilt" 
              value={formData.YearBuilt} 
              onChange={handleChange} 
              placeholder="e.g., 2005"
              min="1800" max={new Date().getFullYear()}
              required 
            />
          </label>
          <br />
          <label>
            <FaWarehouse /> Finished Basement Area (in sq ft):
            <input 
              type="number" 
              name="BsmtFinSF1" 
              value={formData.BsmtFinSF1} 
              onChange={handleChange} 
              placeholder="e.g., 0 to 2000"
              min="0" 
              required 
            />
          </label>
          <br />
          <label>
            <FaHome /> Total Rooms Above Ground(excluding bathrooms):
            <input 
              type="number" 
              name="TotRmsAbvGrd" 
              value={formData.TotRmsAbvGrd} 
              onChange={handleChange} 
              placeholder="e.g., 2 to 14"
              min="1" 
              required 
            />
          </label>
          <br />
          <label>
            <FaCar /> Number of Garage Cars:
            <input 
              type="number" 
              name="GarageCars" 
              value={formData.GarageCars} 
              onChange={handleChange} 
              placeholder="e.g., 2"
              min="0" max="4"
              required 
            />
          </label>
          <br />
          <label>
            <FaWarehouse /> Garage Area (in sq ft):
            <input 
              type="number" 
              name="GarageArea" 
              value={formData.GarageArea} 
              onChange={handleChange} 
              placeholder="e.g., 0 to 1500"
              min="0" 
              required 
            />
          </label>
          <br />
          <button type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Predict'}</button>
        </form>
        {loading && <p>Loading...</p>}
        {prediction !== null && <p>Prediction: ${prediction.toLocaleString()}</p>} {/* Format as currency */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Houseprice;




// This below codes are old codes for testing and debugging


// import React, { useState } from 'react';
// import { FaBuilding, FaChartArea, FaCalendarAlt, FaHome, FaRulerCombined, FaWarehouse, FaCar } from 'react-icons/fa'; // Importing icons

// function Houseprice() {
//   const [formData, setFormData] = useState({
//     MSSubClass: '',
//     MSZoning: '',
//     LotArea: '',
//     OverallQual: '',
//     YearBuilt: '',
//     TotalBsmtSF: '',
//     GrLivArea: '',
//     GarageCars: '',
//   });
//   // for prediction only
//   const [prediction, setPrediction] = useState(null);
//   // const [predictions, setPredictions] = useState({
//   //   elasticNet: null,
//   //   gradientBoost: null,
//   //   combined: null,
//   // });
//   const [error, setError] = useState('');

//   // Handle form data change
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:8000/predict/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();
//       // for prediction only
//       setPrediction(result.prediction);
//       // setPredictions({
//       //   elasticNet: result.elastic_net_prediction,
//       //   gradientBoost: result.gradient_boosting_prediction,
//       //   combined: result.combined_prediction,
//       // });
//       setError('');
//     } catch (err) {
//       setError('Error fetching prediction');
//       // for only prediction
//       setPrediction(null);
//       // setPredictions({
//       //   elasticNet: null,
//       //   gradientBoost: null,
//       //   combined: null,
//       // });
//     }
//   };

//   return (
//     <div>
//       <h1>House Price Prediction</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           <FaBuilding /> Property Type (MSSubClass):
//           <input 
//             type="number" 
//             name="MSSubClass" 
//             value={formData.MSSubClass} 
//             onChange={handleChange} 
//             placeholder="e.g., 60 (Residential)"
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaHome /> Zoning Classification (MSZoning):
//           <input 
//             type="text" 
//             name="MSZoning" 
//             value={formData.MSZoning} 
//             onChange={handleChange} 
//             placeholder="e.g., RL (Residential Low Density)"
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaRulerCombined /> Lot Area (in sq ft):
//           <input 
//             type="number" 
//             name="LotArea" 
//             value={formData.LotArea} 
//             onChange={handleChange} 
//             placeholder="e.g., 9600"
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaChartArea /> Overall Quality (1-10):
//           <input 
//             type="number" 
//             name="OverallQual" 
//             value={formData.OverallQual} 
//             onChange={handleChange} 
//             placeholder="e.g., 7"
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaCalendarAlt /> Year Built:
//           <input 
//             type="number" 
//             name="YearBuilt" 
//             value={formData.YearBuilt} 
//             onChange={handleChange} 
//             placeholder="e.g., 2005"
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaWarehouse /> Total Basement Area (in sq ft):
//           <input 
//             type="number" 
//             name="TotalBsmtSF" 
//             value={formData.TotalBsmtSF} 
//             onChange={handleChange} 
//             placeholder="e.g., 1040"
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaChartArea /> Ground Living Area (in sq ft):
//           <input 
//             type="number" 
//             name="GrLivArea" 
//             value={formData.GrLivArea} 
//             onChange={handleChange} 
//             placeholder="e.g., 1710"
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaCar /> Number of Garage Cars:
//           <input 
//             type="number" 
//             name="GarageCars" 
//             value={formData.GarageCars} 
//             onChange={handleChange} 
//             placeholder="e.g., 2"
//             required 
//           />
//         </label>
//         <br />
//         <button type="submit">Predict</button>
//       </form>
//       {prediction !== null && <p>Prediction: {prediction}</p>}
//       {/* {predictions.elasticNet !== null && (
//         <div>
//           <h2>Predictions:</h2>
//           <p><strong>Elastic Net Prediction:</strong> {predictions.elasticNet}</p>
//           <p><strong>Gradient Boosting Prediction:</strong> {predictions.gradientBoost}</p>
//           <p><strong>Combined Prediction:</strong> {predictions.combined}</p>
//         </div>
//       )} */}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// }

// export default Houseprice;

// import React, { useState } from 'react';
// import './All.css';
// import { FaBuilding, FaChartArea, FaCalendarAlt, FaHome, FaRulerCombined, FaWarehouse, FaCar } from 'react-icons/fa'; // Importing icons

// function Houseprice() {
//   const [formData, setFormData] = useState({
//     OverallQual: '', // Overall Quality (1-10)
//     TotalArea: '', // Total Area (sum of all areas)
//     GrLivArea: '', // Ground Living Area (in sq ft)
//     GarageCars: '', // Number of Garage Cars
//     // TotalBathrooms: '', // Total Number of Bathrooms
//     TotalBsmtSF: '', // Total Basement Area (in sq ft)
//     '1stFlrSF': '', // First Floor Area (in sq ft)
//     YearBuilt: '', // Year Built
//   });

//   const [prediction, setPrediction] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Handle form data change
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setPrediction(null);

//     try {
//       const response = await fetch('http://localhost:8000/predict/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();
//       setPrediction(result.prediction);
//       setError('');
//     } catch (err) {
//       setError('Error fetching prediction');
//       setPrediction(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-container">
//       <div className="form-content">
//       <h1 className="center-content">House Price Prediction</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           <FaChartArea /> Overall Quality (1-10) :
//           <input 
//             type="number" 
//             name="OverallQual" 
//             value={formData.OverallQual} 
//             onChange={handleChange} 
//             placeholder="e.g., 7"
//             min="1" max="10"
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaRulerCombined /> Total Area (in sq ft) :
//           <input
//             type="number" 
//             name="TotalArea" 
//             value={formData.TotalArea} 
//             onChange={handleChange} 
//             placeholder="e.g., 3000"
//             min="0" 
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaChartArea /> Ground Living Area (in sq ft) :
//           <input 
//             type="number" 
//             name="GrLivArea" 
//             value={formData.GrLivArea} 
//             onChange={handleChange} 
//             placeholder="e.g., 1710"
//             min="0" 
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaCar /> Number of Garage Cars :
//           <input 
//             type="number" 
//             name="GarageCars" 
//             value={formData.GarageCars} 
//             onChange={handleChange} 
//             placeholder="e.g., 2"
//             min="0" max="5" 
//             required 
//           />
//         </label>
//         <br />
//         {/* <label>
//           <FaHome /> Total Number of Bathrooms :
//           <input 
//             type="number" 
//             name="TotalBathrooms" 
//             value={formData.TotalBathrooms} 
//             onChange={handleChange} 
//             placeholder="e.g., 2.5"
//             min="0" step="0.5" // Allows half numbers like 2.5
//             required 
//           />
//         </label>
//         <br /> */}
//         <label>
//           <FaWarehouse /> Total Basement Area (in sq ft) :
//           <input 
//             type="number" 
//             name="TotalBsmtSF" 
//             value={formData.TotalBsmtSF} 
//             onChange={handleChange} 
//             placeholder="e.g., 1040"
//             min="0" 
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaWarehouse /> First Floor Area (in sq ft) :
//           <input 
//             type="number" 
//             name="1stFlrSF" 
//             value={formData['1stFlrSF']} 
//             onChange={handleChange} 
//             placeholder="e.g., 1200"
//             min="0" 
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           <FaCalendarAlt /> Year Built :
//           <input 
//             type="number" 
//             name="YearBuilt" 
//             value={formData.YearBuilt} 
//             onChange={handleChange} 
//             placeholder="e.g., 2005"
//             min="1800" max={new Date().getFullYear()} 
//             required 
//           />
//         </label>
//         <br />
//         <button type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Predict'}</button>
//       </form>
//       {loading && <p>Loading...</p>}
//       {prediction !== null && <p>Prediction: ${prediction.toLocaleString()}</p>} {/* Format as currency */}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//     </div>
//   );
// }

// export default Houseprice;




