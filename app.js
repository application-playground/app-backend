const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 4100;
app.set('secretKey', 'nodeRestApi'); // jwt secret token

// connection to mongodb
const mongoose = require('./config/database'); //database 
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.header('Content-Type', 'application/json; charset=utf-8');
    next();
});
 

app.get('/favicon.ico', (req, res) => { res.sendStatus(204); });
app.get('/', (req, res) => { res.json({ "tutorial": "Build REST API with node.js" }); });

const indexRoute = require('./routes/index');
const moviesRoute = require('./routes/movies.route');
const usersRoute = require('./routes/users');

// public route
app.use('/index', indexRoute);
app.use('/users', usersRoute);

// private route
app.use('/movies', validateUser, moviesRoute);

/* ---------------------------------------------------------------------------------- */
function validateUser(req, res, next) {
    
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({ status: "error", message: err.message, data: null });
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}

// handle 404 error
// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use((err, req, res, next) => {
    
    console.log(err);
    if (err.status === 404)
        res.status(404).json({ message: "Not found" });
    else
        res.status(500).json({ message: "Something looks wrong :( !!!" });
});

/* ---------------------------------------------------------------------------------- */
app.listen(port, () => { console.log(`application running ${port}`); });
/* ---------------------------------------------------------------------------------- */
module.exports = app;
