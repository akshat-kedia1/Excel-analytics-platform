const dotenv = require('dotenv');
dotenv.config();
const express =  require('express');
const cors = require('cors');
const app = express();
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes.js');
const morgan = require('morgan');

app.use(express.json());

connectToDb();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev')); 
app.get('/',(req,res)=>{
    res.send('Hello World');
})
app.use('/users', userRoutes);

module.exports = app;
