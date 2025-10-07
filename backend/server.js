import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import cors from 'cors';
import createError from 'http-errors'; 
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js'; 

connectDB();

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json()); 
app.use(cors()); 


app.use('/api/users', userRoutes); 
app.use('/api/certificates', certificateRoutes);


app.get('/', (req, res) => {
  res.send('Certificate Verification System Backend API is running...');
});


app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));