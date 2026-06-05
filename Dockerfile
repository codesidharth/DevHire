FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./

RUN pip install --no-cache-dir \
    fastapi==0.136.3 \
    uvicorn==0.48.0 \
    sqlalchemy==2.0.50 \
    psycopg2-binary==2.9.12 \
    "passlib[bcrypt]==1.7.4" \
    bcrypt==4.0.1 \
    "python-jose[cryptography]==3.5.0" \
    python-multipart==0.0.30 \
    python-dotenv==1.2.2 \
    "pydantic[email]==2.13.4" \
    email-validator==2.3.0 \
    alembic==1.18.4 \
    httpx==0.28.1

COPY . .

EXPOSE 7860

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]