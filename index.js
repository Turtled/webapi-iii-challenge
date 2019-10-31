// code away!
port = parseInt(process.env.PORT, 10) || 8080;
const server = require('./server')



server.listen(port, () => console.log('API running on port ' + port));