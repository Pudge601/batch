var chai           = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    batch          = require('../src/batch'),
    promise        = require('promise');

chai.use(chaiAsPromised);
chai.should();

describe('#forEach', function() {
    var noop = function() {};

    it('returns a promise', function() {
        batch.forEach([], noop).should.be.instanceof(promise);
    });

    it('resolves with no value', function() {
        return batch.forEach([], noop).should.eventually.be.an('undefined');
    });

    it('iterates over every element', function(done) {
        var items  = [1,2,3,4,5],
            result = [];

        batch.forEach(items, function(item) {
            result.push(item);
        }).should.be.fulfilled.then(function() {
            result.should.have.length(items.length)
                .and.have.members(items);
        }).should.notify(done);
    });
});

describe('#map', function() {
    var noop = function(x) { return x; },
        double = function(x) { return x * 2; };

    it('returns a promise', function() {
        batch.map([], noop).should.be.instanceof(promise);
    });

    it('resolves with new array', function() {
        return batch.map([], noop).should.eventually.be.instanceof(Array);
    });

    it('resolves with mapped array', function() {
        return batch.map([1, 2, 3, 4], double).should.eventually.have.members([2,4,6,8]);
    });
});

describe('#reduce', function() {
    var noop = function(acc) { return acc;},
        sum  = function(acc, x) { return acc + x; };

    it('returns a promise', function() {
        batch.reduce([], noop, 0).should.be.instanceof(promise);
    });

    it('resolves with accumulated value', function() {
        return batch.reduce([], noop, 10).should.eventually.equal(10);
    });

    it('resolves with accumulated sum', function() {
        return batch.reduce([1, 2, 3, 4], sum, 0).should.eventually.equal(10);
    });
});

describe('#filter', function() {
    var all  = function() { return true; },
        none = function() { return false; },
        even = function(x) { return (x % 2) === 0; };

    it('returns a promise', function() {
        batch.filter([], all).should.be.instanceof(promise);
    });

    it('resolves with an array', function() {
        return batch.filter([], all).should.eventually.be.instanceof(Array);
    });

    it('resolves with all elements', function() {
        return batch.filter([1, 2, 3, 4], all).should.eventually.have.members([1, 2, 3, 4]);
    });

    it('resolves with no elements', function() {
        return batch.filter([1, 2, 3, 4], none).should.eventually.be.have.length(0);
    });

    it('resolves with even elements', function() {
        return batch.filter([1, 2, 3, 4], even).should.eventually.have.members([2, 4])
            .and.have.length(2);
    });
});
