import requests
import urllib.parse
import torch
import torchvision.transforms as transforms
from PIL import Image
from io import BytesIO
from ultralytics import YOLO
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
knee_crop_model = YOLO("models/knee_crop.pt")
knee_classification_model = YOLO("models/knee_classification.pt")

@app.route("/process_knee")
def process_knee_scan():
    scan_url = request.args.get("url")
    decoded_url = urllib.parse.unquote(scan_url)

    response = requests.get(decoded_url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content))
        
        try:
            knee_crop_result = knee_crop_model.predict(image)[0]
            x1, y1, x2, y2 = map(int, knee_crop_result.boxes[0].xyxy[0].numpy())

            boundary = 50
            x1, y1, x2, y2 = x1 - boundary, y1 - boundary, x2 + boundary, y2 + boundary
            cropped_scan = image.crop((x1, y1, x2, y2)).convert("RGB")

            transform = transforms.Compose([
                transforms.Resize((640, 640)),  
                transforms.ToTensor(),          
            ])
        
            cropped_tensor = transform(cropped_scan).unsqueeze(0)  
            
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            cropped_tensor = cropped_tensor.to(device)

            final_results = knee_classification_model.predict(cropped_tensor)[0]

            final_predictions = list(map(lambda val: round(val, 3), final_results.probs.data.tolist()))
            return jsonify({"healthy": final_predictions[0], "doubtful": final_predictions[1], "minimal": final_predictions[2], "moderate": final_predictions[3], "severe": final_predictions[4]}), 200

        except Exception as e:
            print(e)
            return jsonify({"error": "invalid scan"}), 400

    else:
        return jsonify({"error": "invalid scan url"}), 400
    
if __name__ == "__main__":
    app.run(port = 5000, debug = True)
