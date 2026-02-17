# Node + Python image for OCR (easyocr) + Express backend
FROM node:18-bullseye

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend
COPY backend/ ./

# Install Python OCR deps first (easyocr + torch are large)
RUN pip3 install --break-system-packages -r requirements.txt

# Install Node deps
RUN npm ci --omit=dev

EXPOSE 5000
CMD ["node", "index.js"]
