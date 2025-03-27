import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import indexRoutes from './routes/indexRoutes'
import { requestLogger } from './middlewares/requestLogger'
import session from "express-session";

//for loading the env variables
dotenv.config()

//for the initiqallazion of express app
const app = express()

//middilewares
app.use(express.json()) // to parse the json data
app.use(express.urlencoded({ extended: true })) // to parse the form data
app.use(express.static('public')) // to serve the static files, not planning to use it
app.use(express.static('uploads')) // to serve the static files, not planning to use it
app.use(cors()) // to allow the cross origin requests

//session middileware
app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
    })
  );

// Middleware to log detailed request & response info
app.use(requestLogger);

//routes
app.use('/', indexRoutes)


export default app;




