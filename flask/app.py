import requests
import urllib.parse
from PIL import Image
from io import BytesIO
from ultralytics import YOLO
from flask import Flask, jsonify, request
from flask_cors import CORS
from keras._tf_keras.keras.applications import EfficientNetB5
from keras._tf_keras.keras.models import Model
from keras._tf_keras.keras.layers import BatchNormalization, Dense, Dropout
from keras import regularizers
import tensorflow as tf
from keras import backend as K
from keras._tf_keras.keras.applications.efficientnet import preprocess_input
import numpy as np
from PIL import Image

def build_model(num_classes, img_shape, weights_path):
    K.clear_session()
    base_model = tf.keras.applications.EfficientNetB5(include_top = False, weights = weights_path, input_shape=img_shape, pooling = 'max')
    base_model.trainable = True
    x = base_model.output
    x = BatchNormalization(axis = -1, momentum = 0.99, epsilon = 0.001)(x)
    x = Dense(256, kernel_regularizer = regularizers.l2(0.016), activity_regularizer = regularizers.l1(0.006), bias_regularizer = regularizers.l1(0.006), activation = 'relu')(x)
    x = Dropout(rate = .4, seed = 123)(x)
    output = Dense(num_classes, activation = 'softmax')(x)
    model = Model(inputs = base_model.input, outputs = output)
    return model

img_size = (224, 224)
img_shape = (img_size[0], img_size[1], 3)
num_classes = 3
weights_path = 'models/knee_model/efficientnetb5_notop.h5'

new_model = build_model(num_classes, img_shape, weights_path)
new_model.load_weights('models/knee_model/model_weights.h5')
new_model.compile(optimizer = 'Adamax', loss = 'categorical_crossentropy', metrics = ['accuracy'])

def preprocess_pillow_image(pil_img, img_size):
    img = pil_img.resize(img_size)
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis = 0)
    img_array = preprocess_input(img_array)
    return img_array

def predict_classes(pil_img):
    img_array = preprocess_pillow_image(pil_img, img_size)
    predictions = new_model.predict(img_array)
    return predictions.tolist()

app = Flask(__name__)
CORS(app)
knee_crop_model = YOLO("models/knee_crop.pt")

@app.route("/process_knee")
def process_knee_scan():
    scan_url = request.args.get("url")
    decoded_url = urllib.parse.unquote(scan_url)

    response = requests.get(decoded_url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content)).convert("RGB")
        
        try:
            # knee_crop_result = knee_crop_model.predict(image)[0]
            # x1, y1, x2, y2 = map(int, knee_crop_result.boxes[0].xyxy[0].numpy())

            # boundary = 50
            # x1, y1, x2, y2 = x1 - boundary, y1 - boundary, x2 + boundary, y2 + boundary
            # cropped_scan = image.crop((x1, y1, x2, y2)).convert("RGB")

            final_result = predict_classes(image)
            print(final_result)

            return jsonify({"healthy": round(final_result[0][0], 2), "moderate": round(final_result[0][1], 2), "severe": round(final_result[0][2], 2)})

        except Exception as e:
            print(e)
            return jsonify({"error": "invalid scan"}), 400

    else:
        return jsonify({"error": "invalid scan url"}), 400
    
if __name__ == "__main__":
    app.run(port = 5000, debug = True)
