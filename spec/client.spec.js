var gavagai = require('../lib'),
    assert = require('chai').assert;

describe('The gavagai rest client constructor', function () {

    it('should accept apikey as constructor parameter', function () {
        var expectedKey = 'this-is-a-fake-api-key';
        var client = new gavagai.RestClient(expectedKey);
        assert(client.apikey === expectedKey);
    });

    it('should use default host if not set', function () {
        var client = new gavagai.RestClient('x');
        assert(client.host === 'https://api.gavagai.se');
    });

    it('should use default api version if not set', function () {
        var client = new gavagai.RestClient('x');
        assert(client.apiVersion === 'v3');
    });

    it('should use default timeout if not set', function () {
        var client = new gavagai.RestClient('x');
        assert(client.timeout === 60000);
    });

    it('should compose a base url with api version', function () {
        var client = new gavagai.RestClient('x');
        assert(client.getBaseUrl() === 'https://api.gavagai.se/v3');
    });

    it('should accept custom api version', function () {
        var client = new gavagai.RestClient('x', {
            apiVersion: 'v2'
        });
        assert(client.apiVersion === 'v2');
    });

    it('should accept custom protocol and host', function () {
        var client = new gavagai.RestClient('x', {
            host: 'http://example.com' // explicit http
        });
        assert(client.getBaseUrl() === 'http://example.com/v3', 'getBaseUrl');
        assert(client.host === 'http://example.com', 'host');
    });

    it('should accept custom timeout', function () {
        var client = new gavagai.RestClient('x', {
            timeout: 12345
        });
        assert(client.timeout === 12345);
    });

    it('should use environment variables, if defined', function () {
        var oldApiKey = process.env.GAVAGAI_APIKEY;

        process.env.GAVAGAI_APIKEY = 'foo';
        var client = gavagai();
        assert(client.apikey === 'foo');

        process.env.GAVAGAI_APIKEY = oldApiKey;
    });

    it('should throw if no apikey is present', function () {
        var oldApiKey = process.env.GAVAGAI_APIKEY;

        delete process.env.GAVAGAI_APIKEY;
        assert.throw(function() { gavagai(); }, /GAVAGAI_APIKEY environment variable/);

        process.env.GAVAGAI_APIKEY = oldApiKey;
    });

});

describe('The gavagai module', function () {

    it('should provide the rest client as a single liner', function () {
        var fake_apiKey = 'this-is-a-fake-api-key';

        var client = require('../lib')(fake_apiKey);

        assert(client instanceof gavagai.RestClient);
        assert(client.apikey === fake_apiKey, 'apikey');
    });

});