const mongoose = require('mongoose');
//default.json file stores all the global variable.
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try{
        await mongoose.connect(db, {useNewUrlParser: true});

        console.log('MongoDB connected...');
    } catch(err) {
        console.error(err.message);
        //Exit the process with failure.
        process.exit(1);
    }
};

module.exports = connectDB;