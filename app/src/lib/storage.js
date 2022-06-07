var levelup = require('levelup');
var leveldown = require('leveldown');

// 1) Create our store
const db = levelup(leveldown('/opt/deepwater/data/deep.db'));


async function get(key, callback) {
      await db.get(key, function (err, data) {
          if (!err) {
              callback(JSON.parse(data));
          } else {
              callback(null);
          }
      });
}

async function put(key, data) {
    await db.put(key, JSON.stringify(data), function (err) {
        if (err) return console.log('Ooops!', err);
        console.log(key, data, 'store');
    });
}

async function fetch(options, callback) {
    var result = [];
    await db.createReadStream(options)
        .on('data', function (data) {
            console.log(JSON.parse(data));
            result.push(JSON.parse(data));
        }).on('close', function () {
            callback(result);
        })
}

module.exports = {
    put,
    get,
    fetch,
    db
};
