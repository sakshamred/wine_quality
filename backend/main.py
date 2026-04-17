from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Allow requests from your future Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins for testing; you can restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model you just trained
model = joblib.load('wine_quality_model.pkl')

class WineData(BaseModel):
    alcohol: float
    fixed_acidity: float
    pH: float
    sulphates: float

@app.post("/predict")
def predict_quality(data: WineData):
    input_df = pd.DataFrame([{
        'alcohol': data.alcohol,
        'fixed acidity': data.fixed_acidity,
        'pH': data.pH,
        'sulphates': data.sulphates
    }])
    prediction = model.predict(input_df)
    return {"predicted_quality": int(prediction[0])}