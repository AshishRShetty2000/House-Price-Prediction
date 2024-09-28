from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained Elastic Net model and the feature names
model = joblib.load('elastic_net_model.pkl')  # Ensure the path to your model is correct
feature_names = joblib.load('feature_names.pkl')  # Load feature names used during training

@app.route('/predict', methods=['POST'])
def predict():
    # Get the JSON data from the POST request
    data = request.get_json(force=True)
    
    # Convert the input JSON into a DataFrame
    input_data = pd.DataFrame([data])
    
    # Ensure the input data has the same features and order as the training data
    input_data = input_data.reindex(columns=feature_names, fill_value=0)
    
    # Make predictions using the trained model
    prediction = model.predict(input_data)
    
    # Return the prediction as a JSON response
    return jsonify({'prediction': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)


