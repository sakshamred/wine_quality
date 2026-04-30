import os

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# In production, set ALLOWED_ORIGINS on Render to your Vercel URL, e.g.:
#   https://your-project.vercel.app
# In development (env var not set), all origins are allowed.
_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = ["*"] if _origins_env == "*" else [o.strip() for o in _origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = joblib.load("wine_quality_model.pkl")


class WineData(BaseModel):
    alcohol: float
    fixed_acidity: float
    pH: float
    sulphates: float


@app.get("/")
def health_check():
    return {"status": "ok", "service": "wine-quality-api"}


@app.post("/predict")
def predict_quality(data: WineData):
    input_df = pd.DataFrame(
        [
            {
                "alcohol": data.alcohol,
                "fixed acidity": data.fixed_acidity,
                "pH": data.pH,
                "sulphates": data.sulphates,
            }
        ]
    )
    prediction = model.predict(input_df)
    return {"predicted_quality": int(prediction[0])}
