from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load the pre-trained ElasticNet model and feature names
model = joblib.load('elastic_net_model.pkl')
feature_names = joblib.load('feature_names.pkl')  # Load the feature names

@app.route('/predict', methods=['POST'])
def predict():
    # Get data from the POST request (assuming JSON format)
    data = request.json
    
    # Convert the data into a pandas DataFrame
    input_data = pd.DataFrame([data])
    
    # Align the input data with the training features
    input_data = input_data.reindex(columns=feature_names, fill_value=0)  # Fill missing values with 0
    
    # Make predictions using the loaded model
    prediction = model.predict(input_data)
    
    # Convert prediction back from log1p (if applicable)
    predicted_price = np.expm1(prediction)
    # Handle cases where the prediction results in infinity
    if np.isinf(predicted_price).any():
        predicted_price = np.nan_to_num(predicted_price, nan=0.0, posinf=0.0, neginf=0.0)
    
    # Return the prediction as a JSON response
    return jsonify({'SalePrice': predicted_price[0]})

if __name__ == '__main__':
    app.run(debug=True)

