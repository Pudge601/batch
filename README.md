# jsbatch

## Batch Iterator for NodeJS and Browser

A module for providing asynchronous batch iteration of arrays, using promises for callbacks.

The purpose of this library is essentially to provide a simple implementation of the concept shown in [this blog post](https://www.nczonline.net/blog/2009/08/11/timed-array-processing-in-javascript/),
with the addition of some helper methods for map and reduce, and using promises for the callback when the work is complete.

This library should allow for heavy processing of javascript arrays without locking up the browser/thread, by performing
the work asynchronously and pausing between batches of work.

## Installation

```
npm install jsbatch --save
```

## Example

Map an array, doubling each value.
```javascript
var batch = require('jsbatch');

batch.map([1, 2, 3, 4, 5], function(x) { return 2 * x; })
    .then(function(mapped) {
        console.log(mapped); // [2, 4, 6, 8, 10]
    });
```

The methods can also be applied to the array prototype.
```javascript
require('jsbatch').applyToArray();

[1, 2, 3, 4, 5].batchReduce(function(accum, x) { return accum * x; }, 1)
    .then(function(mapped) {
        console.log(mapped); // 120
    });
```
