# Node + Python image for OCR (easyocr) + Express backend
FROM node:18-bullseye

# Install Python and pip
RUN apt-get update \
  && apt-get install -y python3 python3-pip libgl1 libglib2.0-0 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
