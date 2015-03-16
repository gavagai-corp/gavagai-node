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

    it('should accept an array of text objects', function (done) {
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
            myCustomOption: 'optionally optional'
        };

        validateApiRequest(function (body) {
            assert(body.language === 'sv', 'body language');
            assert(body.myCustomOption === 'optionally optional', 'body customOption');
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
            .post('/v3/stories?apiKey=abc123', validator)
            .reply(200, {});
    }

    function requiredValues(body) {
        assert.property(body, 'texts');
        assert.isArray(body.texts);
        assert.property(body.texts[0], 'id');
        assert.property(body.texts[0], 'body');
        return true;
    }

    afterEach(function () {
        nock.cleanAll();
    })
});

