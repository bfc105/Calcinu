from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Scientific Calculators API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://127.0.0.1",
        "http://16.171.36.129"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOOLS_DIR = os.path.join(BASE_DIR, "tools")


# ----- Request Models -----
class EnergyRequest(BaseModel):
    mass: float


class UnorderedOneToOne(BaseModel):
    domain: str
    field: str
    topic: str
    tool: str
    input: str


# ----- Routes -----
@app.post("/api/calculate/energy")
def calculate_energy(data: EnergyRequest):
    try:
        result = subprocess.run(
            ["java", "-cp", TOOLS_DIR, "EnergyCalculator", str(data.mass)],
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


@app.post("/api/unordered_one_to_one")
def unordered_one_to_one(data: UnorderedOneToOne):

    domain = data.domain
    domain = domain[0].upper() + domain[1:]
    field = data.field
    field = field[0].upper() + field[1:]
    topic = data.topic
    topic = topic[0].upper() + topic[1:] 
    tool_name_parts = data.tool.split("_")
    tool_name_parts = [name[0].upper() + name[1:] for name in tool_name_parts]
    tool = "_".join(tool_name_parts)

    tool_path = os.path.join(TOOLS_DIR, domain, field, topic)

    try:
        result = subprocess.run(
            ["java", "-cp", tool_path, tool, data.input],
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

    print(energy)
    return {"energy": energy}