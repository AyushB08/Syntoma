from keras._tf_keras.keras.applications.mobilenet import MobileNet
from keras._tf_keras.keras.layers import GlobalAveragePooling2D, Dense, Dropout, Flatten
from keras._tf_keras.keras.models import Sequential

# from keras.applications.mobilenet import MobileNet
# from keras.layers import GlobalAveragePooling2D, Dense, Dropout, Flatten
# from keras.models import Sequential

base_mobilenet_model = MobileNet(input_shape = (128, 128, 1), 
                                 include_top = False, weights = None)
multi_disease_model = Sequential()
multi_disease_model.add(base_mobilenet_model)
multi_disease_model.add(GlobalAveragePooling2D())
multi_disease_model.add(Dropout(0.5))
multi_disease_model.add(Dense(512))
multi_disease_model.add(Dropout(0.5))
multi_disease_model.add(Dense(13, activation = 'sigmoid'))
multi_disease_model.compile(optimizer = 'adam', loss = 'binary_crossentropy', metrics = ['binary_accuracy', 'mae'])

multi_disease_model.load_weights("models/xray.h5")