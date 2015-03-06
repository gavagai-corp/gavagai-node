'use strict';

var gavagai = require('../lib'),
    assert = require('chai').assert,
    nock = require('nock'),
    Q = require('q');

describe('The gavagai API stories resource', function () {
    var texts = require('./data/texts.json');
    var client = gavagai('abc123');
    var api;

    it('should have default language', function (done) {
        validateApiRequest(function (body) {
            var defaultLanguage = 'en';
            assert(body.language === defaultLanguage);
            return requiredValues(body);
        });
        client.stories(texts, function (err, data) {
            assert(api.isDone() === true, "Matching API call.");
            done();
        });
    });

    it('should accept an array of document objects', function (done) {
        validateApiRequest(requiredValues);
        client.stories(texts, function (err, data) {
            assert(api.isDone() === true, "Matching API call.");
            done();
        });
    });

    it('should accept an array of strings', function (done) {
        validateApiRequest(requiredValues);
        client.stories(['this is a text', 'this is text 2', 'this is a third text'], function () {
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
            assert.sameMembers(body.terms, ['term', 'term phrase'], 'body terms');
            return requiredValues(body);
        });

        client.stories(texts, options, function () {
            assert(api.isDone() === true, "Matching API call.");
            done();
        });
    });

    it('should return a promise', function () {
        var p = client.stories({});
        assert(Q.isPromise(p), 'promise');
    });

    function validateApiRequest(validator) {
        api = nock('https://api.gavagai.se:443')
            .filteringPath(/language=[^&]*/g, 'language=XX')
            // TODO: remove detailed and language from url
            .post('/v3/stories?detailed=true&language=XX&apiKey=abc123', validator)
            .reply(200, {});
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

