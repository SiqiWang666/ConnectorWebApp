const express = require('express');
const connectDB = require('./config/dbConnection');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

//Connect database.
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//app.get('/', (req, res) => res.send('API Running'));
//Define  Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

// Server static assets in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
