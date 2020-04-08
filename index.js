const express = require('express') 
const cors = require('cors')
const dotenv = require('dotenv')
const app = express();
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db');

//Import routes
const authRoute = require('./routes/auth')

dotenv.config({ path: './config/config.env' });

connectDB();

//Middleware packages
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use((req,res,next)=> {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if(req.method === "OPTIONS"){
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
  }
  next();
})

//Route Middlewares
app.use('/api/user',authRoute)


app.listen(5000,() => console.log('Server started on 5000'))

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message} `);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
  