import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { uploadRouter } from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'Moda Backend Çalışıyor!' });
});

app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  
  if (!text || !targetLang) {
    return res.status(400).json({ error: 'text ve targetLang gerekli' });
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|${targetLang}`
    );

    const data = await response.json();
    
    if (data.responseStatus !== 200) {
      throw new Error('Çeviri başarısız: ' + data.responseMessage);
    }

    const translated = data.responseData.translatedText;
    res.json({ translated });
  } catch (error) {
    console.error('Translate error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.use('/api', uploadRouter);

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});