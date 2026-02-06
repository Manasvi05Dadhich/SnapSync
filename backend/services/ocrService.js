const { spawn } = require('child_process');
const path = require('path');

const extractTextFromImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    // Path to the Python script
    const pythonScript = path.join(__dirname, 'ocr.py');
    // Use absolute path so Python can find the file regardless of cwd
    const absoluteImagePath = path.isAbsolute(imagePath)
      ? imagePath
      : path.resolve(process.cwd(), imagePath);

    // Use 'python' on Windows, 'python3' on Unix
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

    const pythonProcess = spawn(pythonCommand, [pythonScript, absoluteImagePath], {
      cwd: __dirname,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result.text);
        }
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
};

module.exports = { extractTextFromImage };
