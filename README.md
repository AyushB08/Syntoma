# Syntoma

## Pre-requisites 
1. Create a Uploadthing account.
2. Create a Neon.tech account, create a PostgresSQL DB.
3. Make a .env.local file in root directory and add your Uploadthing key to this field "UPLOADTHING_SECRET".

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
4. `python app.py` to run the ml-based backend.

### Created by Ayush Bheemaiah and Jainish Patel for the Congressional App Challenge 2024
