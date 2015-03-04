'use strict';

var request = require('sync-request');
var should = require('should');
var gavagai = require('../../lib');
var client;

if (process.env.GAVAGAI_APIKEY) {
    client = gavagai(process.env.GAVAGAI_APIKEY);
} else {
    StoriesCallbacks = null;
    TopicsCallbacks = null;
    TonalityCallbacks = null;
}

describe('Smoke tests for api.gavagai.se', function () {
    this.timeout(4000);

    it('get stories summary using callbacks', StoriesCallbacks);
    it('get stories summary using promises', StoriesPromises);
    it('get topics summary using callbacks', TopicsCallbacks);
    it('get topics summary using promises', TopicsPromises);
    it('get tonality analysis using callbacks', TonalityCallbacks);
    it('get tonality analysis using promises', TonalityPromises);
    it('get tonality.fromTopics using callbacks', TonalityFromTopicsCallbacks);
    it('get tonality.fromTopics using promises', TonalityFromTopicsPromises);

    before(function () {
        if (!client) {
            console.warn("  -> Warning: Integration tests need a GAVAGAI_APIKEY environment variable to be set.")
        }
    });
});

// Specifications

function StoriesCallbacks(done) {
    var texts = swaggerDefaultRequest('documents', 'https://developer.gavagai.se/swagger/spec/stories.json');

    client.stories(texts, function (err, data) {
        should.not.exist(err);
        data.should.have.property('stories');
        data.stories.length.should.be.greaterThan(0);
        data.stories[0].should.have.properties(['keywords', 'documents']);
        done();
    });
}

function StoriesPromises(done) {
    var texts = swaggerDefaultRequest('documents', 'https://developer.gavagai.se/swagger/spec/stories.json');

    client.stories(texts)
        .then(function (data) { data.should.have.property('stories'); })
        .done(done);
}

function TopicsCallbacks(done) {
    var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');

    client.topics(texts, function (err, data) {
        should.not.exist(err);
        data.should.have.property('topics');
        data.topics.length.should.be.greaterThan(0);
        data.topics[0].should.have.properties(['keywords', 'texts']);
        done();
    });
}

function TopicsPromises(done) {
    var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');

    client.topics(texts)
        .then(function (data) { data.should.have.property('topics') })
        .done(done);
}

function TonalityCallbacks(done) {
    var texts = swaggerDefaultRequest('documents', 'https://developer.gavagai.se/swagger/spec/tonality.json');

    client.tonality(texts, function (err, data) {
        should.not.exist(err);
        data.should.have.property('documents');
        data.documents.length.should.be.greaterThan(0);
        data.documents[0].should.have.properties(['id', 'tonality']);
        done();
    });
}

function TonalityPromises(done) {
    var texts = swaggerDefaultRequest('documents', 'https://developer.gavagai.se/swagger/spec/tonality.json');

    client.tonality(texts)
        .then(function (data) { data.should.have.property('documents'); })
        .done(done);
}

function TonalityFromTopicsCallbacks(done) {
    var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');

    client.topics(texts, function (err, data) {
        should.not.exist(err);
        client.tonality.fromTopics(data, function (err, data) {
            should.not.exist(err);
            data.should.have.property('documents');
            data.documents.length.should.be.greaterThan(0);
            data.documents[0].should.have.properties(['id', 'tonality']);
            done();
        });
    });
}

function TonalityFromTopicsPromises(done) {
    var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');

    client.topics(texts)
        .then(client.tonality.fromTopics)
        .then(function (data) { data.should.have.property('documents'); })
        .done(done);
}

// Utils

/**
 * Get default request body from swagger docs at developer.gavagai.se
 */
function swaggerDefaultRequest(propName, url) {
    var res = request('GET', url);
    res.statusCode.should.equal(200);

    var swaggerSpec = JSON.parse(res.getBody('utf8'));
    var defaultBody = swaggerSpec
        .apis[0]
        .operations[0]
        .parameters.filter(function (element) { return element.paramType === 'body'; })[0]
        .defaultValue;

    var result = JSON.parse(defaultBody)[propName];

    // validate basic assertions
    result.should.be.an.Array;
    result.length.should.be.greaterThan(0);

    return result;

}

