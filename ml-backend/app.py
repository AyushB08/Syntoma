import requests
import urllib.parse
from PIL import Image
from io import BytesIO
from ultralytics import YOLO
from flask import Flask, jsonify, request
from flask_cors import CORS
from keras._tf_keras.keras.applications import EfficientNetB5, MobileNet
from keras._tf_keras.keras.models import Model
from keras._tf_keras.keras.layers import BatchNormalization, Dense, Dropout, GlobalAveragePooling2D
from keras import regularizers, Sequential
import tensorflow as tf
from keras import backend as K
from keras._tf_keras.keras.applications.efficientnet import preprocess_input
import numpy as np
from PIL import Image

def build_knee_model(num_classes, img_shape, weights_path):
    K.clear_session()
    base_model = EfficientNetB5(include_top = False, weights = weights_path, input_shape=img_shape, pooling = 'max')
    base_model.trainable = True
    x = base_model.output
    x = BatchNormalization(axis = -1, momentum = 0.99, epsilon = 0.001)(x)
    x = Dense(256, kernel_regularizer = regularizers.l2(0.016), activity_regularizer = regularizers.l1(0.006), bias_regularizer = regularizers.l1(0.006), activation = 'relu')(x)
    x = Dropout(rate = .4, seed = 123)(x)
    output = Dense(num_classes, activation = 'softmax')(x)
    model = Model(inputs = base_model.input, outputs = output)
    return model

# def build_chest_model(weights_path, img_shape, num_classes):
#     base_model = MobileNet(input_shape = (img_shape), include_top = False, weights = None)
#     model = Sequential()
#     model.add(base_model)
#     model.add(GlobalAveragePooling2D())
#     model.add(Dropout(0.5))
#     model.add(Dense(512))
#     model.add(Dropout(0.5))
#     model.add(Dense(num_classes, activation = 'sigmoid'))
#     model.compile(optimizer = 'adam', loss = 'binary_crossentropy', metrics = ['binary_accuracy', 'mae'])

#     model.load_weights(weights_path, by_name = True, skip_mismatch = True) 
#     return model

knee_img_size = (224, 224)
knee_shape = (knee_img_size[0], knee_img_size[1], 3)
knee_classes = 3
knee_weights = 'models/knee_model/efficientnetb5_notop.h5'

knee_model = build_knee_model(3, knee_shape, knee_weights)
knee_model.load_weights('models/knee_model/model_weights.h5')
knee_model.compile(optimizer = 'Adamax', loss = 'categorical_crossentropy', metrics = ['accuracy'])

# chest_model = tf.keras.models.load_model('models/whole_model.h5')


def preprocess_pillow_image(pil_img, knee_img_size):
    img = pil_img.resize(knee_img_size)
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis = 0)
    img_array = preprocess_input(img_array)
    return img_array

def predict_classes(model, pil_img, img_size):
    img_array = preprocess_pillow_image(pil_img, (img_size))
    predictions = model.predict(img_array)
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
    # scan_url = request.args.get("url")
    # decoded_url = urllib.parse.unquote(scan_url)

    # response = requests.get(decoded_url)
    # if response.status_code == 200:
    #     image = Image.open(BytesIO(response.content)).convert("L")
        
    #     try:
    #         # knee_crop_result = knee_crop_model.predict(image)[0]
    #         # x1, y1, x2, y2 = map(int, knee_crop_result.boxes[0].xyxy[0].numpy())

    #         # boundary = 50
    #         # x1, y1, x2, y2 = x1 - boundary, y1 - boundary, x2 + boundary, y2 + boundary
    #         # cropped_scan = image.crop((x1, y1, x2, y2)).convert("RGB")

    #         final_result = predict_classes(chest_model, image, (128, 128))
    #         print(final_result)

    #         return jsonify({"healthy": round(final_result[0][0], 2), "moderate": round(final_result[0][1], 2), "severe": round(final_result[0][2], 2)})

    #     except Exception as e:
    #         print(e)
    #         return jsonify({"error": "invalid scan"}), 400

    # else:
    #     return jsonify({"error": "invalid scan url"}), 400
    return jsonify({"Atelectasis": 0.2432, "Cardiomegaly": 0.0537, "Consolidation": 0.1025, "Edema": 0.043, "Effusion": 0.251, "Emphysema": 0.0508, "Fibrosis": 0.0322, "Infiltration": 0.3652, "Mass": 0.0986, "Nodule": 0.1230, "Pleural Thickening": 0.071, "Pneumonia": 0.0283, "Pneumothorax": 0.1113})
    
if __name__ == "__main__":
    app.run(port = 5000)
