'use strict';

var request = require('sync-request');
var should = require('should');
var gavagai = require('../../lib');
var client;

if (process.env.GAVAGAI_APIKEY) {
    client = gavagai(process.env.GAVAGAI_APIKEY);
} else {
    StoriesUsingCallbacks = null;
    TopicsUsingCallbacks = null;
    TonalityUsingCallbacks = null;
}

describe('Smoke tests for api.gavagai.se', function () {
    this.timeout(3000);

    it('get stories summary using callbacks', StoriesUsingCallbacks);
    it('get topics summary using callbacks', TopicsUsingCallbacks);
    it('get tonality analysis using callbacks', TonalityUsingCallbacks);

    before(function () {
        if (!client) {
            console.warn("  -> Warning: Integration tests need a GAVAGAI_APIKEY environment variable to be set.")
        }
    });
});

// Specifications

function StoriesUsingCallbacks(done) {
    var texts = swaggerDefaultRequest('documents', 'https://developer.gavagai.se/swagger/spec/stories.json');
    texts.should.be.an.Array;
    texts.length.should.be.greaterThan(0);

    client.stories(texts, function (err, data) {
        data.should.have.property('stories');
        data.stories.length.should.be.greaterThan(0);
        data.stories[0].should.have.properties(['keywords', 'documents']);
        done();
    });
}

function TopicsUsingCallbacks(done) {
    var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');
    texts.should.be.an.Array;
    texts.length.should.be.greaterThan(0);

    client.topics(texts, function (err, data) {
        data.should.have.property('topics');
        data.topics.length.should.be.greaterThan(0);
        data.topics[0].should.have.properties(['keywords', 'texts']);
        done();
    });
}

function TonalityUsingCallbacks(done) {
    var texts = swaggerDefaultRequest('documents', 'https://developer.gavagai.se/swagger/spec/tonality.json');
    texts.should.be.an.Array;
    texts.length.should.be.greaterThan(0);

    client.tonality(texts, function (err, data) {
        data.should.have.property('documents');
        data.documents.length.should.be.greaterThan(0);
        data.documents[0].should.have.properties(['id', 'tonality']);
        done();
    });
}

// Utils

/**
 * Get default request body from swagger docs at developer.gavagai.se
 */
function swaggerDefaultRequest(propName, url) {
    var res = request('GET', url);
    res.statusCode.should.equal(200);

    var swagger = JSON.parse(res.getBody('utf8'));
    var json = swagger
        .apis[0]
        .operations[0]
        .parameters.filter(function (element) { return element.paramType === 'body'; })[0]
        .defaultValue;

    var defaultValue = JSON.parse(json);
    defaultValue.should.have.property(propName);

    return defaultValue[propName];
}

