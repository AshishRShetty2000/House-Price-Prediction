#combine fitting by averaging for both algos ---

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import joblib
import json
from django.views.decorators.csrf import csrf_exempt
import pandas as pd

# Loading the trained model
model_path = r'./mlmodels/trained_models.pkl'
with open(model_path, 'rb') as file:
    model_dict = joblib.load(file)

# Print the dictionary contents
print("Model dictionary contents:")
for key, value in model_dict.items():
    print(f"Key: {key}, Type: {type(value)}")

# Ensure the model_dict is a dictionary
if not isinstance(model_dict, dict):
    raise ValueError("Loaded object is not a dictionary containing models.")

# Extract models
elastic_net_model = model_dict.get('best_elastic_net')
gboost_model = model_dict.get('best_gboost')

# Define the expected feature names in the correct order
feature_names = [
    'MasVnrArea', 'SaleType_WD', 'OverallQual', 'OverallCond',
    'ExterQual_Gd', 'ExterCond_Fa', 'BsmtUnfSF', 'BsmtFinType1_LwQ',
    'LotArea', 'YearBuilt', 'BsmtFinSF1', 'TotRmsAbvGrd',
    'GarageCars', 'GarageArea'
]

# Set weights for the models
weight1 = 0.5  
weight2 = 0.5

@csrf_exempt
def predict(request):
    if request.method == 'POST':
        try:
            # Parsing the JSON data from the request
            body = json.loads(request.body)
            
            # Checking all required features are present in the request
            missing_features = [feature for feature in feature_names if feature not in body]
            if missing_features:
                return JsonResponse({'error': f'Missing features: {", ".join(missing_features)}'}, status=400)
            
            # Create a DataFrame with the correct feature names and convert types accordingly
            input_data = pd.DataFrame([{
                'MasVnrArea': float(body.get('MasVnrArea', 0)),
                'SaleType_WD': int(body.get('SaleType_WD', 0)),
                'OverallQual': int(body['OverallQual']),
                'OverallCond': int(body.get('OverallCond', 5)),
                'ExterQual_Gd': int(body.get('ExterQual_Gd', 0)),
                'ExterCond_Fa': int(body.get('ExterCond_Fa', 0)),
                'BsmtUnfSF': float(body.get('BsmtUnfSF', 0)),
                'BsmtFinType1_LwQ': int(body.get('BsmtFinType1_LwQ', 0)),
                'LotArea': float(body['LotArea']),
                'YearBuilt': int(body['YearBuilt']),
                'BsmtFinSF1': float(body.get('BsmtFinSF1', 0)),
                'TotRmsAbvGrd': int(body['TotRmsAbvGrd']),
                'GarageCars': int(body['GarageCars']),
                'GarageArea': float(body['GarageArea'])
            }], columns=feature_names)
            
            input_data = input_data.reindex(columns=feature_names, fill_value=0)
            
            # Used for checking the model type
            # print("Model type (Elastic Net):", type(elastic_net_model))
            # print("Model type (Gradient Boosting):", type(gboost_model))

            # printing the input data 
            print("input_data", input_data)

            # Make prediction using both models
            prediction_elastic_net = elastic_net_model.predict(input_data)
            prediction_gboost = gboost_model.predict(input_data)
            
            # Combine predictions using weights
            combined_prediction = (weight1 * prediction_elastic_net) + (weight2 * prediction_gboost)
            
            # Print the prediction results
            print("Elastic Net prediction:", prediction_elastic_net)
            print("Gradient Boosting prediction:", prediction_gboost)
            print("Combined prediction:", combined_prediction)

            # Return the combined prediction as JSON
            return JsonResponse({'prediction': combined_prediction.tolist()})

        except Exception as e:
            print("error", e)
            # Handle exceptions and show error
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


# This below codes are old codes that used for testing and debugging

# from django.shortcuts import render
# from django.http import HttpResponse, JsonResponse
# import joblib
# import json
# from django.views.decorators.csrf import csrf_exempt
# import pandas as pd

# # Load your trained model
# # model_path = r'elastic_net_model.pkl'
# model_path = r'./gbr_model.pkl'
# with open(model_path, 'rb') as file:
#     model = joblib.load(file)

# # Define the expected feature names in the correct order
# feature_names = [
#     'MSSubClass', 'MSZoning', 'LotArea', 'OverallQual',
#     'YearBuilt', 'TotalBsmtSF', 'GrLivArea', 'GarageCars'
# ]

# # Assuming MSZoning is a categorical feature and needs to be encoded
# # Define the expected categories for MSZoning if needed
# ms_zoning_categories = ['A', 'C', 'FV', 'I', 'RH', 'RL', 'RP', 'RM']

# def home(request): 
#     return HttpResponse("This is the Homepage")

# @csrf_exempt
# def predict(request):
#     if request.method == 'POST':
#         try:
#             # Parse JSON data from the request
#             body = json.loads(request.body)
            
#             # Check if all required features are present in the request
#             missing_features = [feature for feature in feature_names if feature not in body]
#             if missing_features:
#                 return JsonResponse({'error': f'Missing features: {", ".join(missing_features)}'}, status=400)
            
#             # Create a DataFrame with the correct feature names
#             input_data = pd.DataFrame([{
#                 'MSSubClass': int(body['MSSubClass']),
#                 'MSZoning': body['MSZoning'],  # No encoding, assuming model can handle raw categories
#                 'LotArea': float(body['LotArea']),
#                 'OverallQual': int(body['OverallQual']),
#                 'YearBuilt': int(body['YearBuilt']),
#                 'TotalBsmtSF': float(body['TotalBsmtSF']),
#                 'GrLivArea': float(body['GrLivArea']),
#                 'GarageCars': int(body['GarageCars'])
#             }], columns=feature_names)
            
#             # If encoding for MSZoning is needed, apply it here
#             # For example, if MSZoning is one-hot encoded during training, apply the same transformation
#             if 'MSZoning' in input_data.columns:
#                 input_data = pd.get_dummies(input_data, columns=['MSZoning'])
#                 # Align with training features
#                 for category in ms_zoning_categories:
#                     if f'MSZoning_{category}' not in input_data.columns:
#                         input_data[f'MSZoning_{category}'] = 0

#             # Ensure the columns are in the correct order expected by the model
#             input_data = input_data.reindex(columns=model.feature_names_in_, fill_value=0)

#             print("input_data", input_data)

#             # Make prediction using the model
#             prediction = model.predict(input_data)
#             print("prediction", prediction)

#             # Return the prediction as JSON
#             return JsonResponse({'prediction': prediction.tolist()})

#         except Exception as e:
#             # Handle exceptions and provide meaningful error messages
#             return JsonResponse({'error': str(e)}, status=400)

#     return JsonResponse({'error': 'Invalid request method'}, status=400)



# from django.shortcuts import render
# from django.http import HttpResponse, JsonResponse
# import joblib
# import json
# from django.views.decorators.csrf import csrf_exempt
# import pandas as pd

# # Load your trained model
# model_path = r'./gbr_model.pkl'
# with open(model_path, 'rb') as file:
#     model = joblib.load(file)

# # Define the expected feature names in the correct order
# feature_names = [
#     'OverallQual', 'TotalArea', 'GrLivArea', 'GarageCars', 'TotalBsmtSF', '1stFlrSF', 'YearBuilt'
# ]

# def home(request):
#     return HttpResponse("This is the Homepage")

# @csrf_exempt
# def predict(request):
#     if request.method == 'POST':
#         try:
#             # Parse JSON data from the request
#             body = json.loads(request.body)
            
#             # Check if all required features are present in the request
#             missing_features = [feature for feature in feature_names if feature not in body]
#             if missing_features:
#                 return JsonResponse({'error': f'Missing features: {", ".join(missing_features)}'}, status=400)
            
#             # Create a DataFrame with the correct feature names and convert types accordingly
#             input_data = pd.DataFrame([{
#                 'OverallQual': int(body['OverallQual']),
#                 'TotalArea': float(body['TotalArea']),
#                 'GrLivArea': float(body['GrLivArea']),
#                 'GarageCars': int(body['GarageCars']),
#                 # 'TotalBathrooms': float(body['TotalBathrooms']),
#                 'TotalBsmtSF': float(body['TotalBsmtSF']),
#                 '1stFlrSF': float(body['1stFlrSF']),
#                 'YearBuilt': int(body['YearBuilt'])
#             }], columns=feature_names)
            
#             # Ensure the columns are in the correct order expected by the model
#             input_data = input_data.reindex(columns=model.feature_names_in_, fill_value=0)
            
#             # Print the input data
#             print("Model type:", type(model))
#             print("input_data", input_data)

#             # Make prediction using the model
#             prediction = model.predict(input_data)
            
#             # Print the prediction result
#             print("prediction", prediction)

#             # Return the prediction as JSON
#             return JsonResponse({'prediction': prediction.tolist()})

#         except Exception as e:
#             print("error",e)
#             return JsonResponse({'error': str(e)}, status=400)

#     return JsonResponse({'error': 'Invalid request method'}, status=400)


# selecting the model to predict the house price

# from django.shortcuts import render
# from django.http import HttpResponse, JsonResponse
# import joblib
# import json
# from django.views.decorators.csrf import csrf_exempt
# import pandas as pd

# # Load your trained model (assuming it's a dictionary)
# model_path = r'./trained_models.pkl'
# with open(model_path, 'rb') as file:
#     model_dict = joblib.load(file)

# # Print the dictionary contents for debugging
# print("Model dictionary contents:")
# for key, value in model_dict.items():
#     print(f"Key: {key}, Type: {type(value)}")

# # Ensure the model_dict is a dictionary
# if not isinstance(model_dict, dict):
#     raise ValueError("Loaded object is not a dictionary containing models.")

# # Define the expected feature names in the correct order
# feature_names = [
#     'MasVnrArea', 'SaleType_WD', 'OverallQual', 'OverallCond',
#     'ExterQual_Gd', 'ExterCond_Fa', 'BsmtUnfSF', 'BsmtFinType1_LwQ',
#     'LotArea', 'YearBuilt', 'BsmtFinSF1', 'TotRmsAbvGrd',
#     'GarageCars', 'GarageArea'
# ]

# # Select the specific model from the dictionary (example using a specific key)
# # Replace 'default_model' with the actual key you want to use
# # Replace 'default_model' with 'best_gboost' or 'best_elastic_net'
# selected_model_key = 'best_elastic_net'  # Change this to the correct key
# selected_model = model_dict.get(selected_model_key)

# # Check if the selected model has a predict method
# if not hasattr(selected_model, 'predict'):
#     raise ValueError(f"The model selected with key '{selected_model_key}' does not have a 'predict' method.")

# @csrf_exempt
# def predict(request):
#     if request.method == 'POST':
#         try:
#             # Parse JSON data from the request
#             body = json.loads(request.body)
            
#             # Check if all required features are present in the request
#             missing_features = [feature for feature in feature_names if feature not in body]
#             if missing_features:
#                 return JsonResponse({'error': f'Missing features: {", ".join(missing_features)}'}, status=400)
            
#             # Create a DataFrame with the correct feature names and convert types accordingly
#             input_data = pd.DataFrame([{
#                 'MasVnrArea': float(body.get('MasVnrArea', 0)),
#                 'SaleType_WD': int(body.get('SaleType_WD', 0)),
#                 'OverallQual': int(body['OverallQual']),
#                 'OverallCond': int(body.get('OverallCond', 5)),
#                 'ExterQual_Gd': int(body.get('ExterQual_Gd', 0)),
#                 'ExterCond_Fa': int(body.get('ExterCond_Fa', 0)),
#                 'BsmtUnfSF': float(body.get('BsmtUnfSF', 0)),
#                 'BsmtFinType1_LwQ': int(body.get('BsmtFinType1_LwQ', 0)),
#                 'LotArea': float(body['LotArea']),
#                 'YearBuilt': int(body['YearBuilt']),
#                 'BsmtFinSF1': float(body.get('BsmtFinSF1', 0)),
#                 'TotRmsAbvGrd': int(body['TotRmsAbvGrd']),
#                 'GarageCars': int(body['GarageCars']),
#                 'GarageArea': float(body['GarageArea'])
#             }], columns=feature_names)
            
#             # Ensure the columns are in the correct order expected by the model
#             input_data = input_data.reindex(columns=feature_names, fill_value=0)
            
#             # Print the input data
#             print("Model type:", type(selected_model))
#             print("input_data", input_data)

#             # Make prediction using the selected model
#             prediction = selected_model.predict(input_data)
            
#             # Print the prediction result
#             print("prediction", prediction)

#             # Return the prediction as JSON
#             return JsonResponse({'prediction': prediction.tolist()})

#         except Exception as e:
#             print("error", e)
#             # Handle exceptions and provide meaningful error messages
#             return JsonResponse({'error': str(e)}, status=400)

#     # If request method is not POST, return an error response
#     return JsonResponse({'error': 'Invalid request method'}, status=400)

# old code displaying both model prediction and the combined model output ------------------

# from django.shortcuts import render
# from django.http import HttpResponse, JsonResponse
# import joblib
# import json
# from django.views.decorators.csrf import csrf_exempt
# import pandas as pd
# import numpy as np

# elastic_net_model_path = r'./elastic_net_model.pkl'
# gradient_boost_model_path = r'./gbr_model.pkl'

# with open(elastic_net_model_path, 'rb') as file:
#     elastic_net_model = joblib.load(file)

# with open(gradient_boost_model_path, 'rb') as file:
#     gradient_boost_model = joblib.load(file)

# # Define the expected feature names in the correct order
# feature_names = [
#     'MSSubClass', 'MSZoning', 'LotArea', 'OverallQual',
#     'YearBuilt', 'TotalBsmtSF', 'GrLivArea', 'GarageCars'
# ]

# # Assuming MSZoning is a categorical feature and needs to be encoded
# # Define the expected categories for MSZoning if needed
# ms_zoning_categories = ['A', 'C', 'FV', 'I', 'RH', 'RL', 'RP', 'RM']

# def home(request): 
#     return HttpResponse("This is the Homepage")

# @csrf_exempt
# def predict(request):
#     if request.method == 'POST':
#         try:
#             # Parse JSON data from the request
#             body = json.loads(request.body)
            
#             # Check if all required features are present in the request
#             missing_features = [feature for feature in feature_names if feature not in body]
#             if missing_features:
#                 return JsonResponse({'error': f'Missing features: {", ".join(missing_features)}'}, status=400)
            
#             # Create a DataFrame with the correct feature names
#             input_data = pd.DataFrame([{
#                 'MSSubClass': int(body['MSSubClass']),
#                 'MSZoning': body['MSZoning'],  # No encoding, assuming model can handle raw categories
#                 'LotArea': float(body['LotArea']),
#                 'OverallQual': int(body['OverallQual']),
#                 'YearBuilt': int(body['YearBuilt']),
#                 'TotalBsmtSF': float(body['TotalBsmtSF']),
#                 'GrLivArea': float(body['GrLivArea']),
#                 'GarageCars': int(body['GarageCars'])
#             }], columns=feature_names)
            
#             if 'MSZoning' in input_data.columns:
#                 input_data = pd.get_dummies(input_data, columns=['MSZoning'])
#                 for category in ms_zoning_categories:
#                     if f'MSZoning_{category}' not in input_data.columns:
#                         input_data[f'MSZoning_{category}'] = 0

#             # Ensure the columns are in the correct order expected by the model
#             input_data = input_data.reindex(columns=elastic_net_model.feature_names_in_, fill_value=0)

#             print("input_data", input_data)

#             # Make predictions using both models
#             elastic_net_prediction = elastic_net_model.predict(input_data)
#             gradient_boost_prediction = gradient_boost_model.predict(input_data)

#             # Combine predictions (e.g., by averaging)
#             combined_prediction = np.mean([elastic_net_prediction, gradient_boost_prediction], axis=0)

#             print("Elastic Net Prediction:", elastic_net_prediction)
#             print("Gradient Boosting Prediction:", gradient_boost_prediction)
#             print("Combined Prediction:", combined_prediction)

#             # Return the combined prediction as JSON
#             # return JsonResponse({'prediction': combined_prediction.tolist()})
#             return JsonResponse({
#                 'elastic_net_prediction': elastic_net_prediction.tolist(),
#                 'gradient_boosting_prediction': gradient_boost_prediction.tolist(),
#                 'combined_prediction': combined_prediction.tolist()
#             })

#         except Exception as e:
#             print("error",e)
#             # Handle exceptions and provide meaningful error messages
#             return JsonResponse({'error': str(e)}, status=400)

#     return JsonResponse({'error': 'Invalid request method'}, status=400)





