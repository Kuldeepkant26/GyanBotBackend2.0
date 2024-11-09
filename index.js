const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const authroute = require('./Routes/auth')
const postsroute = require('./Routes/posts')
const notifyroute = require('./Routes/notify')

require('dotenv').config();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// const rateLimit = {};
// app.use((req, res, next) => {
//     const userIP = req.ip;

//     // Initialize or update request tracking for the user IP
//     if (!rateLimit[userIP]) {
//         rateLimit[userIP] = { count: 1, startTime: Date.now() };
//     } else {
//         const timeElapsed = Date.now() - rateLimit[userIP].startTime;

//         // Reset count if more than 5 seconds have passed
//         if (timeElapsed > 5000) {
//             rateLimit[userIP] = { count: 1, startTime: Date.now() };
//         } else {
//             rateLimit[userIP].count += 1;
//         }
//     }

//     // Check if the count exceeds 5 requests within the 5-second window
//     if (rateLimit[userIP].count > 50) {
//         return res.status(429).json({
//             success: false,
//             message: "Too many requests. Please wait and try again."
//         });
//     }

//     // Proceed if the request limit has not been exceeded
//     next();
// });

const PORT = process.env.PORT || 8080;


async function dbConnection() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Failed to connect to DB:", error);
    }
}

dbConnection();


app.get('/', (req, res) => {
    res.send('Root route');
})


app.use('/auth', authroute);
app.use('/posts', postsroute);
app.use('/notify', notifyroute)

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
