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