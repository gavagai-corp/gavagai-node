var should = require('should');
var gavagai = require('../lib');

describe('The gavagai rest client constructor', function() {

    it('should accept apikey as constructor parameter', function() {
        var expectedKey = 'this-is-a-fake-api-key';
        var client = new gavagai.RestClient(expectedKey);
        client.apikey.should.equal(expectedKey);
    });

    it('should use default host if not set', function () {
        var client = new gavagai.RestClient('x');
        client.host.should.equal('https://api.gavagai.se');
    });

    it('should use default api version if not set', function () {
        var client = new gavagai.RestClient('x');
        client.apiVersion.should.equal('v3');
    });

    it('should compose a base url with api version', function() {
        var client = new gavagai.RestClient('x');
        client.getBaseUrl().should.equal('https://api.gavagai.se/v3');
    });

    it('should accept custom api version', function () {
        var client = new gavagai.RestClient('x', {
            apiVersion: 'v2'
        });
        client.apiVersion.should.equal('v2');
    });

    it('should accept custom protocol and host', function () {
        var client = new gavagai.RestClient('x', {
            host: 'http://example.com' // explicit http
        });
        client.getBaseUrl().should.equal('http://example.com/v3');
        client.host.should.equal('http://example.com')
    });

    it('should accept custom timeout', function () {
        var client = new gavagai.RestClient('x', {
            timeout: 12345
        });
        client.timeout.should.equal(12345);
    });

    it('should use environment variables, if defined', function() {
        var oldApiKey = process.env.GAVAGAI_APIKEY;

        process.env.GAVAGAI_APIKEY = 'foo';
        var client = gavagai();
        client.apikey.should.equal('foo');

        process.env.GAVAGAI_APIKEY = oldApiKey;
    });

    it('should throw if no apikey is present', function() {
        var oldApiKey = process.env.GAVAGAI_APIKEY;

        delete process.env.GAVAGAI_APIKEY;
        gavagai.should.throw();

        process.env.GAVAGAI_APIKEY = oldApiKey;
    });

});

describe('The gavagai module', function () {

    it('should provide the rest client as a single liner', function () {
        var fake_apiKey = 'this-is-a-fake-api-key';

        var client = require('../lib')(fake_apiKey);

        (client instanceof gavagai.RestClient).should.equal(true);
        client.apikey.should.equal(fake_apiKey);
    });

});