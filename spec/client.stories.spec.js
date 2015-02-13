'use strict';

var should = require('chai').should();
var nock = require('nock');
var Gavagai = require('../lib');
var Stories = require('../lib/Stories');

describe('The gavagai API stories resource #find', function () {
    var stories = new Stories(new Gavagai('abc123'));
    var api;

    it('should accept an array of document objects', function (done) {
        var docs = require('./data/documents.json');
        stories.find(docs, function (err, data) {
            api.isDone().should.equal(true);
            done();
        });
    });

    it.skip('should accept an array of texts', function (done) {
        stories.find(['this is a text', 'this is text 2', 'this is a third text'], function () {
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

