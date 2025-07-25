import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes/index.js'
import connectDB from './configs/db.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
const port = process.env.PORT

app.use(cors({
  origin: [
    'http://localhost:5173', // Your Vite dev server
    'https://farm-fresh-ashy.vercel.app', // Production frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // If using cookies/auth tokens
}));
app.use(express.json())
app.use(cookieParser())
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
