"use strict";

var promise = typeof Promise !== 'undefined' ? Promise : require('promise');

var asap = typeof setImmediate === 'function' ? setImmediate : function (fn) { setTimeout(fn, 15); };

var Batch = {

    forEach: function (items, fn) {
        items = items.concat(); // clone array
        var i = 0;
        return new promise(function (resolve) {
            if (!items.length) {
                resolve();
            }
            var doBatch = function () {
                var start = +new Date();

                do {
                    fn(items[i], i, items);
                    i++;
                } while (i < items.length && +new Date() - start < 50);

                if (i < items.length) {
                    asap(doBatch);
                } else {
                    resolve();
                }
            };
            asap(doBatch);
        });
    },

    map: function (items, fn) {
        var results = [];
        return Batch.forEach(items, function (item, i, arr) {
            results.push(fn(item, i, arr));
        }).then(function () {
            return results;
        });
    },

    reduce: function (items, fn, initial) {
        var accumulator = initial;
        return Batch.forEach(items, function (item, i, arr) {
            accumulator = fn(accumulator, item, i, arr);
        }).then(function () {
            return accumulator;
        });
    },

    applyToArray: function() {
        var methods = {
                batchForEach: 'forEach',
                batchMap: 'map',
                batchReduce: 'reduce'
            },
            applyMethod = function(methodName, actualMethod) {
                Array.prototype[methodName] = function() {
                    var args = [].slice.call(arguments);
                    args.unshift(this);
                    return Batch[actualMethod].apply(null, args);
                };
            }, x;
        for (x in methods) {
            if (methods.hasOwnProperty(x)) {
                applyMethod(x, methods[x]);
            }
        }
    }
};

Batch.version = '1.0.0';

module.exports = Batch;
