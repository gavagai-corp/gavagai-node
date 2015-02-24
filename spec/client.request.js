var should = require('should');
var gavagai = require('../lib');
var nock = require('nock');

describe('The gavagai rest client request', function () {
    var client = new gavagai('x');

    it('should handle method post', function (done) {
        nock(client.host).post('/v3/test?apiKey=x', /.*/)
            .reply(200, {hello: 'world'});

        client.request({method: 'POST', url: '/test', body: {}}, function (err, data, res) {
            res.statusCode.should.equal(200);
            data.should.eql({hello: 'world'});
            done();
        });
    });

    it('should not return error on non-JSON response body', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(200, "this is not json");

        client.request({method: 'GET', url: '/test'}, function (err, data, res) {
            data.should.equal('this is not json');
            done();
        });
    });

    it('should return empty response body', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(200);

        client.request({method: 'GET', url: '/test'}, function (err, data, res) {
            res.statusCode.should.equal(200);
            done();
        });
    });

    it('should return error on host unreachable', function (done) {
        nock(client.host).get('/unreachable_path');

        client.request({method: 'GET', url: '/test'}, function (err, data, res) {
            err.message.should.startWith('Unable to reach host:');
            done();
        });
    });

    it('should return error on a 300 range status', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(302);

        client.request({method: 'GET', url: '/test'}, function (err, data, res) {
            err.status.should.equal(302);
            done();
        });
    });

    it('should return error on a 400 range error', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(404, {message: 'Not found'});

        client.request({method: 'GET', url: '/test'}, function (err, data, res) {
            err.status.should.equal(404);
            err.message.should.equal('Not found');
            done();
        });
    });

    it('should return error on a 500 range error', function (done) {
        nock(client.host).get('/v3/test?apiKey=x')
            .reply(500, 'Internal server error');

        client.request({method: 'GET', url: '/test'}, function (err, data, res) {
            err.status.should.equal(500);
            err.message.should.equal('Internal server error');
            done();
        });
    });

    before(function(){
        nock.disableNetConnect();
    });

    afterEach(function () {
        nock.cleanAll();
    })

    after(function(){
        nock.enableNetConnect();
    });

});