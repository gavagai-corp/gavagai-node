'use strict';

var gavagai = require('../lib'),
    assert = require('chai').assert,
    nock = require('nock'),
    Q = require('q');

describe('The gavagai API lexicon resource', function () {
    var texts = require('./data/texts.json');
    var client = gavagai('abc123');
    var api;

    it('should accept single word with default language', function (done) {
        api = nock('https://api.gavagai.se:443')
            .get('/v3/lexicon/en/foo?apiKey=abc123')
            .reply(200, {foo: 'bar'});

        client.lexicon('foo', function (err, data) {
            assert.equal(data.apiClientResponse.statusCode, 200);
            assert.deepEqual(data, {foo:'bar'});
            done();
        });
    });

    it('should accept a sequence of space separated words', function(done) {
        api = nock('https://api.gavagai.se:443')
            .get('/v3/lexicon/en/foo%20bar?apiKey=abc123')
            .reply(200, {foo: 'foo bar'});

        client.lexicon('foo bar', function (err, data) {
            assert.equal(data.apiClientResponse.statusCode, 200);
            assert.deepEqual(data, {foo:'foo bar'});
            done();
        });

    });

    it('should accept a word and language', function (done) {
        api = nock('https://api.gavagai.se:443')
            .get('/v3/lexicon/sv/foo?apiKey=abc123')
            .reply(200, {foo: 'bar'});

        client.lexicon('foo', 'sv', function (err, data) {
            assert.equal(data.apiClientResponse.statusCode, 200);
            assert.deepEqual(data, {foo:'bar'});
            done();
        });
    });

    it('should return a promise', function () {
        var p1 = client.lexicon('foo');
        assert(Q.isPromise(p1), 'promise');
        var p2 = client.lexicon('foo', 'sv');
        assert(Q.isPromise(p2), 'promise');
    });

    afterEach(function () {
        nock.cleanAll();
    })
});

