const express = require('express');
const connectDB = require('./config/dbConnection');

const app = express();
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('API Running'));
//Connect database.
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
