const express = require("express");
const app = express();

require('dotenv').config()
const cors = require("cors");
const dbconnect = require("./config/db.js");
const bodyParser = require('body-parser');
app.use(express.json());

 
 
 
const userRoute = require('./routers/userRouter.js');
// const productRoute = require('./routes/productRoute');
// const contactRoute = require('./routes/contactRoute');
// const errorHandler = require('./middleware/errorMiddleware.js');
const cookieParser = require('cookie-parser');
// const path = require('path');



// const URL = process.env.FRONTEND_URL;

const port = process.env.PORT || 5000;

// //Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(cors({
//     origin: [URL, 'https://inventorymaster.vercel.app'],//esto es para publicar y vincular backend y frontend
//     credentials: true,
// }));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Error Middlewares
// app.use(errorHandler)
//Routes Middlewares
app.use('/api/users', userRoute);
// app.use('/api/products', productRoute);
// app.use('/api/contactus', contactRoute);

//Routes
app.get('/', (req, res) => {
    res.send('Home page');
});

 

//connect to DB and start server

app.listen(port, (req,res) => {
    console.log(`Server Running on port ${port}`);
})

dbconnect();
