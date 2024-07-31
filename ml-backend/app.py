import random
import requests
import urllib.parse
from PIL import Image
from io import BytesIO
from flask import Flask, jsonify, request
from flask_cors import CORS
from keras._tf_keras.keras.applications import EfficientNetB5
from keras._tf_keras.keras.models import Model, Sequential
from keras._tf_keras.keras.layers import BatchNormalization, Dense, Dropout, GlobalAveragePooling2D
from keras import regularizers
from keras import backend as K
from keras._tf_keras.keras.applications.efficientnet import preprocess_input
from keras._tf_keras.keras.applications.mobilenet import MobileNet
import numpy as np
from PIL import Image

def build_knee_model(num_classes, img_shape, weights_path):
    K.clear_session()
    base_model = EfficientNetB5(include_top=False, weights=weights_path, input_shape=img_shape, pooling='max')
    base_model.trainable = True
    x = base_model.output
    x = BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001)(x)
    x = Dense(256, kernel_regularizer=regularizers.l2(0.016), activity_regularizer=regularizers.l1(0.006), bias_regularizer=regularizers.l1(0.006), activation='relu')(x)
    x = Dropout(rate=0.4, seed=123)(x)
    output = Dense(num_classes, activation='softmax')(x)
    model = Model(inputs=base_model.input, outputs=output)
    return model

def build_chest_model():
    base_mobilenet_model = MobileNet(input_shape = (128, 128, 1), include_top = False, weights = None)
    multi_disease_model = Sequential()
    multi_disease_model.add(base_mobilenet_model)
    multi_disease_model.add(GlobalAveragePooling2D())
    multi_disease_model.add(Dropout(0.5))
    multi_disease_model.add(Dense(512))
    multi_disease_model.add(Dropout(0.5))
    multi_disease_model.add(Dense(13, activation = 'sigmoid'))
    multi_disease_model.compile(optimizer = 'adam', loss = 'binary_crossentropy', metrics = ['binary_accuracy', 'mae'])

    return multi_disease_model

knee_img_size = (224, 224)
knee_shape = (knee_img_size[0], knee_img_size[1], 3)
knee_classes = 3
knee_weights = 'models/knee_model/efficientnetb5_notop.h5'

knee_model = build_knee_model(3, knee_shape, knee_weights)
knee_model.load_weights('models/knee_model/model_weights.h5')
knee_model.compile(optimizer='Adamax', loss='categorical_crossentropy', metrics=['accuracy'])

chest_model = build_chest_model()
chest_model.load_weights("models/xray.h5")

def preprocess_pillow_image(pil_img, knee_img_size):
    img = pil_img.resize(knee_img_size)
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

def predict_classes(model, pil_img, img_size):
    img_array = preprocess_pillow_image(pil_img, img_size)
    predictions = model.predict(img_array)
    return predictions.tolist()

def get_predictions(model, X, threshold=0.5):
    """
    Get predictions from the model and return as a dictionary with class names and confidence scores.

    Args:
    - model: Trained Keras model for multi-label classification.
    - X: Input data to predict (numpy array).
    - labels: List of class names (list of strings).
    - threshold: Confidence threshold for predictions (default 0.5).

    Returns:
    - List of dictionaries containing class name and confidence (in percentage) for each sample.
    """

    labels = [
        "Atelectasis",
        "Cardiomegaly",
        "Consolidation",
        "Edema",
        "Effusion",
        "Emphysema",
        "Fibrosis",
        "Infiltration",
        "Mass",
        "Nodule",
        "Pleural_Thickening",
        "Pneumonia",
        "Pneumothorax"
    ]  

    # Get the predicted probabilities
    predictions = model.predict(X)

    # Prepare the prediction results
    results = []
    for pred in predictions:
        result = {}
        for i, score in enumerate(pred):
            # Convert score to percentage
            percentage_score = score * 100
            if percentage_score > (threshold * 100):
                result[labels[i]] = f"{percentage_score:.2f}%"
        results.append(result)

    return results

app = Flask(__name__)
CORS(app)

@app.route("/process_knee")
def process_knee_scan():
    scan_url = request.args.get("url")
    decoded_url = urllib.parse.unquote(scan_url)

    response = requests.get(decoded_url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content)).convert("RGB")
        
        try:
            final_result = predict_classes(knee_model, image, knee_img_size)
            print(final_result)

            return jsonify({"healthy": round(final_result[0][0], 2), "moderate": round(final_result[0][1], 2), "severe": round(final_result[0][2], 2)})

        except Exception as e:
            print(e)
            return jsonify({"error": "invalid scan"}), 400

    else:
        return jsonify({"error": "invalid scan url"}), 400

@app.route("/process_chest")
def process_chest_scan():
    scan_url = request.args.get("url")
    decoded_url = urllib.parse.unquote(scan_url)

    response = requests.get(decoded_url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content)).convert("L")
        
        try:
            final_result = predict_classes(chest_model, image, (128, 128))
            
            return jsonify({
                "Atelectasis": final_result[0][0],
                "Cardiomegaly": final_result[0][1],
                "Consolidation": final_result[0][2],
                "Edema": final_result[0][3],
                "Effusion": final_result[0][4],
                "Emphysema": final_result[0][5],
                "Fibrosis": final_result[0][6],
                "Infiltration": final_result[0][7],
                "Mass": final_result[0][8],
                "Nodule": final_result[0][9],
                "Pleural Thickening": final_result[0][10],
                "Pneumonia": final_result[0][11],
                "Pneumothorax": final_result[0][12]
            })

        except Exception as e:
            print(e)
            return jsonify({"error": "invalid scan"}), 400

    else:
        return jsonify({"error": "invalid scan url"}), 400

if __name__ == "__main__":
    app.run(port = 5000)
