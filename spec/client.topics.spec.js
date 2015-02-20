'use strict';

var should = require('should');
var nock = require('nock');
var gavagai = require('../lib');

describe('The gavagai API topics resource', function () {
    var docs = require('./data/texts.json');
    var client = gavagai('abc123');
    var api;

    it('should have default language', function(done) {
        validateApiRequest(function(body) {
            var defaultLanguage = 'en';
            body.language.should.equal(defaultLanguage);
            return requiredValues(body);
        });
        client.topics(docs, function (err, data) {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        });
    });

    it('should accept an array of text objects', function (done) {
        validateApiRequest(requiredValues);
        client.topics(docs, function (err, data) {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        });
    });

    it('should accept an array of strings', function (done) {
        validateApiRequest(requiredValues);
        client.topics(['this is a text', 'this is text 2', 'this is a third text'], function () {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        })
    });

    it('should handle custom options', function (done) {
        var options = {
            language: 'sv',
            ignore: ['ignoreword', 'ignore phrase'],
            terms: ['term', 'term phrase']
        };

        validateApiRequest(function(body) {
            body.language.should.equal('sv');
            body.ignore.should.eql(['ignoreword', 'ignore phrase'], 'parameter "ignore"');
            body.terms.should.eql(['term', 'term phrase'], 'parameter "terms"');
            return requiredValues(body);
        });

        client.topics(docs, options, function () {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        });
    });

    function validateApiRequest(validator) {
        api = nock('https://api.gavagai.se:443')
            .post('/v3/topics?apiKey=abc123', validator)
            .reply(200, 'OK');
    }

    function requiredValues(body) {
        body.should.have.property('texts');
        body.texts.should.be.an.Array;
        body.texts[0].should.have.properties('id', 'body');
        return true;
    }

    afterEach(function () {
        nock.cleanAll();
    })
});

