const express = require('express') 
const dotenv = require('dotenv')
const app = express();
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db');

//Import routes
const authRoute = require('./routes/auth')

dotenv.config({ path: './config/config.env' });

connectDB();

//Middleware packages
app.use(express.json())
app.use(cookieParser())

//Route Middlewares
app.use('/api/user',authRoute)


app.listen(5000,() => console.log('Server started on 5000'))

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message} `);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
  