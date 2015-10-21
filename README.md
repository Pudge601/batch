# Batch Iterator for NodeJS and Browser JavaScript

A module for providing asynchronous batch iteration of arrays, returning promises.

## Example

Map an array, doubling each value.
```javascript
var batch = require('batch');

batch.map([1, 2, 3, 4, 5], function(x) { return 2 * x; })
    .then(function(mapped) {
        console.log(mapped); // [2, 4, 6, 8, 10]
    });
```
