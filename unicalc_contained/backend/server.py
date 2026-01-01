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

    print("\n===== /api/unordered_one_to_one DEBUG =====")

    # ----- Normalize names -----
    domain = data.domain[0].upper() + data.domain[1:]
    field = data.field[0].upper() + data.field[1:]
    topic = data.topic[0].upper() + data.topic[1:]

    tool_name_parts = data.tool.split("_")
    tool_name_parts = [name[0].upper() + name[1:] for name in tool_name_parts]
    tool = "_".join(tool_name_parts)

    print("Domain:", domain)
    print("Field:", field)
    print("Topic:", topic)
    print("Tool (Java class):", tool)
    print("Input:", data.input)

    # ----- Paths -----
    tool_path = os.path.join(TOOLS_DIR, domain, field, topic)

    print("\nTOOLS_DIR:", TOOLS_DIR)
    print("Resolved tool_path:", tool_path)
    print("CWD:", os.getcwd())

    # ----- Inspect filesystem -----
    try:
        print("\nContents of tool_path:")
        for entry in os.listdir(tool_path):
            print(" -", entry)
    except Exception as e:
        print("ERROR listing tool_path:", repr(e))

    # ----- Check expected class file -----
    class_file = os.path.join(tool_path, f"{tool}.class")
    print("\nExpected class file:", class_file)
    print("Class file exists:", os.path.exists(class_file))

    # ----- Build Java command -----
    command = [
        "java",
        "-cp",
        tool_path,
        tool,
        str(data.input)
    ]

    print("\nRunning Java command:")
    print(" ", " ".join(command))

    # ----- Run Java -----
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=2
        )
    except subprocess.TimeoutExpired:
        print("ERROR: Java execution timed out")
        raise HTTPException(status_code=504, detail="Calculation timed out")

    # ----- Log Java output -----
    print("\nJava return code:", result.returncode)
    print("Java stdout:")
    print(result.stdout or "[empty]")
    print("Java stderr:")
    print(result.stderr or "[empty]")

    # ----- Handle Java error -----
    if result.returncode != 0:
        raise HTTPException(
            status_code=500,
            detail=f"Java error: {result.stderr}"
        )

    # ----- Parse result -----
    try:
        energy = float(result.stdout.strip())
    except ValueError:
        print("ERROR: Java output not a valid float")
        raise HTTPException(
            status_code=500,
            detail="Invalid output from calculator"
        )

    print("\nResult energy:", energy)
    print("===== END DEBUG =====\n")

    return {"energy": energy}