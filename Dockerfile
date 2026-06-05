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

# Install uv globally
RUN pip install --no-cache-dir uv

# Copy dependency tracking files first for caching optimization
COPY pyproject.toml uv.lock ./

# Synchronize project dependencies cleanly using native uv sync
# This replaces the system pip workaround and creates a rock-solid ecosystem
RUN uv sync --frozen --no-dev

# Copy the rest of the application source code files
COPY . .

# Expose FastAPI's network channel interface
EXPOSE 7860

# Fire up the application using uv run to execute within the synchronized environment
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]