# Node + Python image for OCR (easyocr) + Express backend
FROM node:18-bullseye

# Install Python and pip
RUN apt-get update \
  && apt-get install -y python3 python3-pip libgl1 libglib2.0-0 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend
COPY backend/ ./

RUN pip3 install --no-cache-dir -r requirements.txt

# Install Node deps
RUN npm ci --omit=dev

EXPOSE 5000
CMD ["node", "index.js"]
