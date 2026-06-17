import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { uploadRouter } from './routes/upload.js';



dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin:'*',
    methods:['GET', 'POST', 'DELETE', 'OPTOIONS'],
    allowedHeaders:['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api', uploadRouter);

app.get('/', (req,res)=>{
    res.json({status:'Moda Backend Çalışıyor!'});
});

app.listen(PORT, ()=>{
    console.log(`Server ${PORT} portunda çalışıyor`);
    
})

app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    const translated = data[0].map((item) => item[0]).join('');
    res.json({ translated });
  } catch (error) {
    res.status(500).json({ error: 'Çeviri başarısız' });
  }
});