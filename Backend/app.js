import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes/index.js'
import connectDB from './configs/db.js'
import cookieParser from 'cookie-parser'


dotenv.config()
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
  'http://localhost:5173',
  'https://farm-fresh-ashy.vercel.app/', // 🔁 Replace with your actual Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies
  })
);
app.use('/api',router)

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // ✅ log actual error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});


connectDB()
.then(console.log(`db connected successfully url`))
.catch(err=>{
    console.log(err)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
