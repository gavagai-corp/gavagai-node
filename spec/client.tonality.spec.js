'use strict';

var gavagai = require('../lib'),
    assert = require('chai').assert,
    nock = require('nock'),
    Q = require('q');

describe('The gavagai API tonality resource', function () {
    var texts = require('./data/texts.json');
    var client = gavagai('abc123');
    var api;

    it('should have default language', function (done) {
        validateApiRequest(function (body) {
            var defaultLanguage = 'en';
            assert(body.language === defaultLanguage);
            return requiredValues(body);
        });
        client.tonality(texts, function (err, data) {
            assert(api.isDone() === true, "Matching API call.");
            done();
        });
    });

    it('should accept an array of text objects', function (done) {
        validateApiRequest(requiredValues);
        client.tonality(texts, function (err, data) {
            assert(api.isDone() === true, "Matching API call.");
            done();
        });
    });

    it('should accept an array of strings', function (done) {
        validateApiRequest(requiredValues);
        client.tonality(['this is a text', 'this is text 2', 'this is a third text'], function () {
            assert(api.isDone() === true, "Matching API call.");
            done();
        })
    });

    it('should accept a single string', function (done) {
        validateApiRequest(requiredValues);
        client.tonality('this is a text', function () {
            assert(api.isDone() === true, "Matching API call.");
            done();
        })
    });

    it('should handle custom options', function (done) {
        var options = {
            language: 'sv',
            terms: ['term', 'term phrase']
        };

        validateApiRequest(function (body) {
            assert(body.language === 'sv', 'body language');
            assert.sameMembers(body.terms,['term', 'term phrase'], 'body terms');
            return requiredValues(body);
        });

        client.tonality(texts, options, function () {
            assert(api.isDone() === true, "Matching API call.");
            done();
        });
    });

    it('should return a promise for tonality', function () {
        var p = client.tonality({});
        assert(Q.isPromise(p),'promise');
    });

    describe('fromTopics method', function () {
        var topics = require('./data/topics.json');

        it('should transform N topics output into a tonality call with N texts.', function (done) {
            validateApiRequest(function (body) {
                requiredValues(body);
                assert(body.documents.length === topics.topics.length);
                return true;
            });

            client.tonality.fromTopics(topics, function (err, data) {
                assert(!err, 'no error');
                assert(api.isDone() === true, "Matching API call.");
                done();
            });
        });

        it('should call back with error on bad topics input', function (done) {
            client.tonality.fromTopics({}, function (err, data) {
                assert(err, 'error');
                assert(err.status === 500);
                done();
            })
        });

        it('should return a promise', function () {
            var topics = require('./data/topics.json');
            var p = client.tonality.fromTopics(topics);
            assert(Q.isPromise(p), 'promise');
        });

        it('should return reject promise on bad topics input', function (done) {
            var rejected;
            var p = client.tonality.fromTopics({});
            p.catch(function (e) {
                rejected = e;
            }).done(function () {
                assert(rejected, 'rejected');
                done();
            });
        });
    });

    function validateApiRequest(validator) {
        api = nock('https://api.gavagai.se:443')
            .filteringPath(/language=[^&]*/g, 'language=XX')
            // TODO: remove language from url
            .post('/v3/tonality?language=XX&apiKey=abc123', validator)
            .reply(200, {'dummy': 'reply'});
    }

    function requiredValues(body) {
        assert.property(body, 'documents');
        assert.isArray(body.documents);
        assert.property(body.documents[0], 'id');
        assert.property(body.documents[0], 'body');
        return true;
    }

    afterEach(function () {
        nock.cleanAll();
    })
});

