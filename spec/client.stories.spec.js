'use strict';

var should = require('chai').should();
var nock = require('nock');
var gavagai = require('../lib');


describe('The gavagai API stories resource', function () {
    var client = gavagai('abc123');
    var api;

    it('should accept an array of document objects', function (done) {
        var docs = require('./data/documents.json');
        client.stories(docs, function (err, data) {
            api.isDone().should.equal(true);
            done();
        });
    });

    it.skip('should accept an array of texts', function (done) {
        client.stories(['this is a text', 'this is text 2', 'this is a third text'], function () {
            api.isDone().should.equal(true);
            done();
        })
    });

    beforeEach(function () {
        api = nock('https://api.gavagai.se:443')
            .post('/v3/stories?language=en&apiKey=abc123', validate)
            .reply(200, 'OK');
    });

    function validate(body) {
        body.should.include.keys('documents');
        body.documents.should.be.an('Array');
        body.documents[0].should.be.an('object');
        body.documents[0].should.include.keys('title', 'body');
        return true;
    }

    afterEach(function () {
        nock.cleanAll();
    })
});

