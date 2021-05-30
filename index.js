'use strict';

const express = require('express'),
    app = express(),
    cors = require('cors'),
    config = require('./config')
;


app.use(express.json());
app.use(cors());

//register routes
app.use('/auth', require('./auth/auth.route'));
app.use('/users', require('./user/user.route'));


//Capture All 404 errors
app.use(function (req,res,next){
    //let the error handler take it in
    throw new Error('Requested resource not found');
});
//default error handler
app.use((err, req, res, next) => {
    console.error('Error caught ', err);
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        case err.name === 'ValidationError':
            // mongoose validation error
            return res.status(400).json({ message: err.message });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            return res.status(500).json({ message: err.message });
    }
});

app.listen(config.port, function(){
    console.log('listening on port '+config.port);
});
