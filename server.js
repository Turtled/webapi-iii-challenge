var express = require('express')
var bodyParser = require('body-parser')
var server = express()

const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware
// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
server.use(bodyParser.json())

function logger(req, res, next) {
  console.log("new " + req.method + " request to URL " + req.originalUrl)
  next();
};

server.use(logger);

server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

module.exports = server;
