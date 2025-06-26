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
app.use(cors({
  origin: 'http://localhost:5173', // your frontend
  credentials: true, // allow cookies
}));
app.use('/api',router)

connectDB()
.then(console.log(`db connected successfully url`))
.catch(err=>{
    console.log(err)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
