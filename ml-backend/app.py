import requests
import uvicorn
import urllib.parse
from PIL import Image
from io import BytesIO
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from keras._tf_keras.keras.applications import EfficientNetB5, ResNet152V2
from keras._tf_keras.keras.models import Model, Sequential
from keras._tf_keras.keras.layers import BatchNormalization, Dense, Dropout, GlobalAveragePooling2D, Input
from keras import regularizers
from keras import backend as K
from keras._tf_keras.keras.applications.efficientnet import preprocess_input
from keras._tf_keras.keras.applications.mobilenet import MobileNet
import numpy as np
from PIL import Image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    base_mobilenet_model = MobileNet(input_shape=(128, 128, 1), include_top=False, weights=None)
    multi_disease_model = Sequential()
    multi_disease_model.add(base_mobilenet_model)
    multi_disease_model.add(GlobalAveragePooling2D())
    multi_disease_model.add(Dropout(0.5))
    multi_disease_model.add(Dense(512))
    multi_disease_model.add(Dropout(0.5))
    multi_disease_model.add(Dense(14, activation='sigmoid'))
    multi_disease_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['binary_accuracy', 'mae'])

    return multi_disease_model

knee_img_size = (224, 224)
knee_shape = (knee_img_size[0], knee_img_size[1], 3)
knee_classes = 3
knee_weights = 'models/knee.h5'

knee_model = build_knee_model(3, knee_shape, knee_weights)
knee_model.load_weights('models/knee_model/knee.h5')
knee_model.compile(optimizer='Adamax', loss='categorical_crossentropy', metrics=['accuracy'])

chest_model = build_chest_model()
chest_model.load_weights("models/chest.h5")

base_model = ResNet152V2(weights='imagenet', input_shape=(224, 224, 3), include_top=False)
base_model.trainable = True
for layer in base_model.layers[:-13]:
    layer.trainable = False

def get_modified_resnet():
    inputs = Input(shape=(224, 224, 3))
    x = base_model(inputs)
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.1)(x)
    output = Dense(1, activation='sigmoid')(x)
    model = Model(inputs=[inputs], outputs=output)
    return model

chest_p = get_modified_resnet()
chest_p.load_weights("models/pneumonia.h5")

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

def get_predictions(model, X):
    labels = [
        "Atelectasis", "Cardiomegaly", "Consolidation", "Edema", "Effusion",
        "Emphysema", "Fibrosis", "Infiltration", "Mass", "NoFinding", "Nodule",
        "PleuralThickening", "Pneumonia", "Pneumothorax"
    ]
    predictions = model.predict(X)
    results = []
    for pred in predictions:
        result = {}
        for i, score in enumerate(pred):
            result[labels[i]] = f"{score:.2f}"
        results.append(result)
    return results

@app.get("/process_knee")
async def process_knee_scan(url: str = Query(...)):
    decoded_url = urllib.parse.unquote(url)
    response = requests.get(decoded_url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content)).convert("RGB")
        try:
            final_result = predict_classes(knee_model, image, knee_img_size)
            return {"healthy": round(final_result[0][0], 2), "moderate": round(final_result[0][1], 2), "severe": round(final_result[0][2], 2)}
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid scan")
    else:
        raise HTTPException(status_code=400, detail="Invalid scan URL")

@app.get("/process_chest")
async def process_chest_scan(url: str = Query(...)):
    decoded_url = urllib.parse.unquote(url)
    response = requests.get(decoded_url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content)).convert("L")
        try:
            final_result = get_predictions(chest_model, preprocess_pillow_image(image, (128, 128)))[0]
            return final_result
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid scan")
    else:
        raise HTTPException(status_code=400, detail="Invalid scan URL")

@app.get("/process_chest_p")
async def process_chest_p(url: str = Query(...)):
    decoded_url = urllib.parse.unquote(url)
    response = requests.get(decoded_url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content)).convert("RGB")
        try:
            final_result = predict_classes(chest_p, image, (224, 224))
            return {"normal": round(1 - final_result[0][0], 2), "pneumonia": round(final_result[0][0], 2)}
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid scan")
    else:
        raise HTTPException(status_code=400, detail="Invalid scan URL")


if __name__ == "__main__":
    uvicorn.run("app:app", host = "0.0.0.0", port = 5000, reload = True)