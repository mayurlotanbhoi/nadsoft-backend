import express, { urlencoded } from 'express'
import cors from "cors"
import rateLimit from 'express-rate-limit';
import errorHandler from './middlewares/errorHandler.middleware.js';



const app = express()



const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(limiter);

app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
const allowedOrigins = [
    '*',
    'http://localhost:5173',

];


app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


import Student from "./Routes/student.routes.js"
import Mark from "./Routes/marks.routes.js"

app.use('/api/v1/student', Student)
app.use('/api/v1/marks', Mark)



app.get('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});



app.use(errorHandler);


export default app;
