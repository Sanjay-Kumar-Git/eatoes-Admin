require('dotenv').config();
const express=require('express');
const cors=require('cors');
const connectDB=require('./config/db');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');




const app=express();

//Middleware
app.use(cors());
app.use(express.json());
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);



//connect DB
connectDB();

//Test Route
app.get('/',(req,res)=>{
    res.send('Eatoes API is running...');
});

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`);
});