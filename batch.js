(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.batch = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"promise":undefined}]},{},[1])(1)
});