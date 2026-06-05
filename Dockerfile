# Use an official lightweight Python runtime matching your environment
FROM python:3.10-slim

# Prevent Python from buffering logs or writing bytecode files
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies required for compiling certain Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies directly with pip (no uv)
COPY pyproject.toml ./
RUN pip install --no-cache-dir fastapi uvicorn sqlalchemy psycopg2-binary \
    passlib[bcrypt] bcrypt==4.0.1 python-jose[cryptography] python-multipart \
    python-dotenv pydantic[email] email-validator alembic httpx

# Copy the rest of the application source code
COPY . .

# Expose HuggingFace required port
EXPOSE 7860

# Start the app directly with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]