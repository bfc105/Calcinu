FROM python:3.11-slim

# Install Java
RUN apt-get update && \
    apt-get install -y default-jre && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend files
COPY . .

# Install Python deps
RUN pip install --no-cache-dir -r requirements.txt

# Expose API port
EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
