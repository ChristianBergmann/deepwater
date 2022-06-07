//######################################################//
//                                                      //
//    REQUIREMENTS                                      //
//######################################################//

const Fastify = require('fastify');
const path = require('path');
const chart_data = require('./data');
const mqttclient = require('./lib/mqtt_client');


//######################################################//
//                                                      //
//    APP                                               //
//######################################################//


const server = Fastify({
    logger: true
});

server.register(require('@fastify/static'), {
    root: path.join(__dirname, 'views'),
    prefix: '/views/',
});

server.get('/', async(request, response) => {
    response.type('application/json').code(200);
    return { hello: 'jkw' };
});

server.get('/jkw', async(request, response) => {
    response.sendFile("main.html");
});

server.get('/data', async(request, response) => {
    if (request.query.type === 'day') {
        chart_data.get_day(response, request.query.param);
    }
    else if (request.query.type === 'week') {
        chart_data.get_14d(response, request.query.param);
    }
});

server.listen(3000, '0.0.0.0', function(err, address) {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }

    mqttclient.start();
});
