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
app.use('/api', uploadRouter);

app.get('/', (req, res) => {
    res.json({ status: 'Moda Backend Çalışıyor!' });
});

app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  
  if (!text || !targetLang) {
    return res.status(400).json({ error: 'text ve targetLang gerekli' });
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });

    if (!response.ok) {
      throw new Error(`Google yanıt vermedi: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data[0]) {
      throw new Error('Geçersiz yanıt formatı');
    }

    const translated = data[0]
      .filter((item) => item && item[0])
      .map((item) => item[0])
      .join('');
      
    res.json({ translated });
  } catch (error) {
    console.error('Translate error:', error.message);
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});