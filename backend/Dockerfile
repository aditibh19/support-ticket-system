FROM python:3.11

WORKDIR /app

# Install netcat (for wait-for-db.sh)
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "./wait-for-db.sh"]