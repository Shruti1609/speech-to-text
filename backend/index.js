const express = require('express');
const multer = require('multer');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// Set up Google Cloud credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'speectotext.json');

const client = new speech.SpeechClient();

// POST /api/transcribe endpoint
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded file and convert it to base64
    const audioBytes = fs.readFileSync(req.file.path).toString('base64');

    const audio = {
      content: audioBytes,
    };

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 44100,
      languageCode: 'en-US',
    };

    const request = {
      audio,
      config,
    };

    // Send audio data to Google Cloud for transcription
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n');

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    // Send the transcription as the response
    res.json({ transcription });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process audio file.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
