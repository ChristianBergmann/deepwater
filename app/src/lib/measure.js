var last = null;
const deep = 438;
const maxWaterLevel = 200;
const maxTime = 1000 * 60;
const maxLevelChanged = 10;

var measure = function(data) {
    var result = false;

    last = data;
    if (data.value > maxWaterLevel) {
        return true;
    }

};

var measure_value = function(data) {
    var data_value = parseFloat(data.value)
    if (!data_value) return
    var value = deep - data_value
    data.value = value.toFixed(2)
    return data;
};

module.exports = {
    measure,
    measure_value
};
