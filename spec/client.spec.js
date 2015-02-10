var should = require('chai').should();
var gavagai = require('../lib');

describe('The gavagai rest client constructor', function() {

    it('should accept apikey as constructor parameter', function() {
        var expectedKey = 'this-is-a-fake-api-key';
        var client = new gavagai.RestClient(expectedKey);
        client.apikey.should.equal(expectedKey);
    });

    it('should use default host if not set', function () {
        var client = new gavagai.RestClient('x');
        client.host.should.equal('api.gavagai.se');
    });

    it('should use default api version if not set', function () {
        var client = new gavagai.RestClient('x');
        client.apiVersion.should.equal('v3');
    });

    it('should compose a base url with api version', function() {
        var client = new gavagai.RestClient('x');
        client.getBaseUrl().should.equal('https://api.gavagai.se/v3');
    });

});

describe('The gavagai module', function () {

    it('should provide the rest client as default', function () {
        var fake_apiKey = 'this-is-a-fake-api-key';

        var client = require('../lib')(fake_apiKey);

        (client instanceof gavagai.RestClient).should.equal(true);
        client.apikey.should.equal(fake_apiKey);
    });

});