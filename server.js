//Imports
let express = require('express');
let bodyParser = require('body-parser');
let apiRouter = require('./apiRouter').router;

//Instantiate server
let server = express();

//Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());


server.get('/', (request, response) => {
    response.setHeader('Content-Type', 'text/html');
    response.status(200).send('<h1>Bonjour sur mon server</h1>')

});

//attach my apiRouter to express's existing  routes
server.use('/api/', apiRouter);

let port = process.env.APP_PORT || 8080;

server.listen(port, () => {
    console.log('Server running on ' + port)
})

//lanch server