const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const connectDB = require('./models/database');

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(express.json());
app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(fileUpload());


app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./routes/recipeRoutes.js');
app.use('/', routes);


const port = process.env.PORT || 3000;



const start = async () => {
    try {
        //connect db
        await connectDB(process.env.MONGO_URI || "mongodb://0.0.0.0:27017");
        app.listen(port, console.log(`Server listening on port ${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();

// connectDB().then(() => {
//     app.listen(port, () => {
//         console.log(`Listning on port ${port}`);
//     })
// })

// module.exports = connectDB;