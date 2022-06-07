const storage = require('./lib/storage');
var moment = require('moment');

function testdata(response) {
    for (let i = 0; i < 15; i++) {
        var start = moment().subtract(i,'d').format('YYYY-MM-DD');
        var now = moment().subtract(i,'d').format('YYYY-MM-DDTHH:mm');
        var key = 'max_day#' + start;
        storage.put(key, JSON.stringify({'time': now, 'value': Math.floor(Math.random() * 20)}));
        console.log(key);
    }
}

async function get_14d(response, param) {
    var end = moment().subtract(14,'d').format('YYYY-MM-DD');
    var start = moment().format('YYYY-MM-DD');

    var options = {
        lte: 'max_day#' + start,
        gte: 'max_day#' + end,
        keys: false,
        values: true
    };

    storage.fetch(options, function (result) {
        response.send(result);
    });
}

async function get_day(response, param) {
    if (param) {
        var start = param.split('T')[0];
    } else {
        var start = moment().format('YYYY-MM-DD');
    }

    var options = {
        'lte': 'measure#' + start + 'T24:59',
        'gte': 'measure#' + start + 'T00:00',
        keys: false,
        values: true
    };

    storage.fetch(options, function (result) {
        response.send(result);
    });
}

module.exports = {
    get_14d,
    get_day,
    testdata
}
