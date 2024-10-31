# Syntoma

## What is Syntoma?
According to the NIH, currently more than 500 million patients have respiratory diseases. In the US, more than 30 million adults have knee osteoarthritis. In addition, diagnosis from doctors can range from 48 hours to a week after an X-ray and typical costs for X-ray diagnosis can range from a costly $100 to $1000. Websites like TalkToCody and Diagnose Me offer online diagnose options for medical images, but are expensive and utilize human examination taking a few days to weeks for results. Overall, the healthcare industry faces significant challenges in diagnosing medical conditions, particularly with X-rays, where the expensive and time-consuming process disproportionately affects geographically underserved communities and minority populations. To remedy this, we built Syntoma, an accessible website that provides quick and accurate early stage diagnosis of pneumonia, 14 chest diseases, and knee osteoarthritis within seconds, while also helping users find clinics and medical information.

## Pre-requisites 
1. Create a Uploadthing account.
2. Create a Neon.tech account and create a PostgreSQL DB.
3. Create a Google Cloud Platform account and create an API key.
4. Make a .env file in the root directory and add your PostgreSQL connection string to this field "CONNECTION_STRING".
5. Make a .env.local file in the client directory and add your Uploadthing key to this field "UPLOADTHING_SECRET".
6. Add your Google Cloud Platform API key to this field "GOOGLE_MAPS_KEY" in your .env file.

## Running Frontend
1. `cd client`
2. `npm install` to install all dependencies.
3. `npm run dev` to run the frontend.

## Running Express Backend
1. `cd express`
2. `npm install` to install all dependencies.
3. `nodemon index` to run the express backend.

## Running ML-Backend
1. `pip install -r "requirements.txt"` to install all dependencies.
2. Download models weights from [here](https://drive.google.com/drive/folders/18zy0jjdfXi1cXyumj-PJqhMBeLL9_08g?usp=sharing), create a folder called "models" and put it under ml-backend directory if it doesn't exist.
3. `cd ml-backend`
4. `python app.py` to run the backend.

### Created by Ayush Bheemaiah and Jainish Patel for the Congressional App Challenge 2024
