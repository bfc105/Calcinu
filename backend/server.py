from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Scientific Calculators API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # React dev server
        # add your domain later, e.g. "https://yourdomain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],   # THIS enables OPTIONS
    allow_headers=["*"],
)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CALC_DIR = os.path.join(BASE_DIR, "calculators")


# ----- Request Models -----
class EnergyRequest(BaseModel):
    mass: float


# ----- Routes -----
@app.post("/calculate/energy")
def calculate_energy(data: EnergyRequest):
    try:
        result = subprocess.run(
            ["java", "-cp", CALC_DIR, "EnergyCalculator", str(data.mass)],
            capture_output=True,
            text=True,
            timeout=2
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Calculation timed out")

    if result.returncode != 0:
        raise HTTPException(status_code=500, detail=result.stderr)

    # The Java calculator prints only a number
    try:
        energy = float(result.stdout.strip())
    except ValueError:
        raise HTTPException(status_code=500, detail="Invalid output from calculator")

    return {"energy": energy}
