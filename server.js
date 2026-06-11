import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { uploadRouter } from './routes/upload.js';



dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin:'*',
    methods:['GET', 'POST', 'DELETE'],
}));

app.use(express.json());
app.use('/api', uploadRouter);

app.get('/', (req,res)=>{
    res.json({status:'Moda Backend Çalışıyor!'});
});

app.listen(PORT, ()=>{
    console.log(`Server ${PORT} portunda çalışıyor`);
    
})