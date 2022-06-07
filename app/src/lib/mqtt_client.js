const mqtt = require('mqtt');
const measure = require('./measure');
const storage = require('./storage');
const moment = require('moment');

function start() {

    var param = {
        "clientId": "measure_app",
        "username": "xx",
        "password": "xxx",
        'keepalive': 60*60
    };

    var client = mqtt.connect('mqtt://127.0.0.1', param);

    client.on('connect', function() {
        client.subscribe('measure', function(err) {
            if (!err) {
                console.log('mqtt client connected');
            }
        })
    });

    client.on('message', function(topic, message) {
        // message is Buffer
        var date = moment();
        var now = date.format('YYYY-MM-DDTHH:mm');
        var value = message.toString();

        var day = date.format('YYYY-MM-DD');
        var month = date.format('YYYY-MM');
        var year = date.format('YYYY');

        var data = {
            "time": date.format('HH:mm'),
            "value": value,
        };

        if (topic === 'measure') {
            data = measure.measure_value(data);
            if (!data) return;
        } else if (topic === 'rain') {
            //
        } else {
            return;
        }

        // store data
        var key = topic + '#' + now;
        storage.put(key, data);

        var daykey = 'max_day#' + day;
        storage.get(daykey, function (result) {
            if (!result || result && result.value < data.value) {
                storage.put(daykey, { 'time': now, 'value': data.value });
                storage.put('days#' + day, day);
            }
        });

        var monthkey = 'max_month#' + month;
        storage.get(monthkey, function (result) {
            if (!result || result && result.value < data.value) {
                storage.put(monthkey, { 'time': now, 'value': data.value });
                storage.put('month#' + month, month);
            }
        });

        var yearkey = 'max_year#' + year;
        storage.get(yearkey, function (result) {
            if (!result || result && result.value < data.value) {
                storage.put(yearkey, { 'time': now, 'value': data.value });
                storage.put('year#' + year, year);
            }
        });

        var sick = measure.measure(data);

        if (sick) {
            client.publish('underwater', data.value);
        }

        console.log(data);
        client.publish('ping', '1');

        //client.end( )
    });
}

module.exports = {
    start
};
