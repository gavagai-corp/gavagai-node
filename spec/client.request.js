'use strict';

var gavagai = require('../lib'),
    assert = require('chai').assert,
    nock = require('nock'),
    Q = require('q');

describe('The gavagai rest client request', function () {
    var client = new gavagai('x');

    it('should include raw node response from api', function (done) {
        nock(client.host).get('/v3/test?apiKey=x', /.*/)
            .reply(201, {hello: 'world'});

        client.request({method: 'GET', url: '/test'}, function (err, data) {
            assert.property(data, 'apiClientResponse');
            assert(data.apiClientResponse.statusCode === 201, 'statusCode 200');
            done();
        });
    });

    it('should handle method post', function (done) {
        nock(client.host).post('/v3/test?apiKey=x', /.*/)
            .reply(200, {hello: 'world'});

        client.request({method: 'POST', url: '/test', body: {}}, function (err, data) {
            assert(data.apiClientResponse.statusCode === 200, 'statusCode 200');
            assert.deepEqual(data, {hello: 'world'});
            done();
        });
    });

    it('should not return error on non-JSON response body', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(200, "this is not json");

        client.request({method: 'GET', url: '/test'}, function (err, data) {
            assert(data === 'this is not json');
            done();
        });
    });

    it('should handle empty response body', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(204);

        client.request({method: 'GET', url: '/test'}, function (err, data) {
            assert(data.apiClientResponse.statusCode === 204);
            done();
        });
    });

    it('should return default error message if empty response body', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(500);

        client.request({method: 'GET', url: '/test'}, function (err, data) {
            assert(err.message === 'Unable to complete HTTP request');
            done();
        });
    });

    it('should return error on host unreachable', function (done) {
        nock(client.host).get('/unreachable_path');

        client.request({method: 'GET', url: '/test'}, function (err, data) {
            assert.match(err.message, /Unable to reach host:/);
            done();
        });
    });

    it('should return error on a 300 range status', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(302);

        client.request({method: 'GET', url: '/test'}, function (err, data) {
            assert(err.status === 302);
            done();
        });
    });

    it('should return error on a 400 range error', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(404, {message: 'Not found'});

        client.request({method: 'GET', url: '/test'}, function (err, data) {
            assert(err.status === 404, 'Error status 404');
            assert(err.message === 'Not found');
            done();
        });
    });

    it('should return error on a 500 range error', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(500, 'Internal server error');

        client.request({method: 'GET', url: '/test'}, function (err, data) {
            assert(err.status === 500, 'Error status 500');
            assert(err.message === 'Internal server error');
            done();
        });
    });

    it('should return a promise', function () {
        var p = client.request({method: 'GET', url: '/test'});
        assert(Q.isPromise(p), 'promise');
    });

    it('should append input language property to output', function (done) {
        nock(client.host).post('/v3/test?apiKey=x', /.*/)
            .reply(200, {hello: 'world'});

        var body = {language: 'fr'};
        client.request({method: 'POST', url: '/test', body: body}, function (err, data) {
            assert.propertyVal(data, 'language', 'fr');
            done();
        });
    });

    before(function () {
        nock.disableNetConnect();
    });

    afterEach(function () {
        nock.cleanAll();
    })

    after(function () {
        nock.enableNetConnect();
    });

});