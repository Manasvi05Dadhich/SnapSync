import easyocr
import sys
import json

def extract_text_from_image(image_path):
    reader = easyocr.Reader(['en'], verbose=False) 
    results = reader.readtext(image_path)
    extracted_text = ' '.join([result[1] for result in results])  
    return extracted_text

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python ocr.py <image_path>"}))
        sys.exit(1)

    image_path = sys.argv[1]
    try:
        text = extract_text_from_image(image_path)
        print(json.dumps({"text": text}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)