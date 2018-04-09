
// Utils

function debug() {
    console.log(arguments);
}

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

if (typeof Object.values !== 'function') {
    Object.values = function (obj) {
        var values = Object.keys(obj).filter(function (key) {
            if (obj.hasOwnProperty(key)) {
                return obj[key];
            }
        });
        return values;
    };
}
