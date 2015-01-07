var should = require('chai').should();
var gavagai = require('../lib');

describe('The gavagai rest client constructor', function() {

    it('should accept apikey as constructor parameter', function() {
        var fake_apiKey = 'this-is-a-fake-api-key';

        var client = new gavagai.RestClient(fake_apiKey);

        client.apikey.should.equal(fake_apiKey);
    });

    it('should use default host if not set', function () {
        var client = new gavagai.RestClient('x');
        client.host.should.equal('api.gavagai.se');
    });

    it('should use default api version if not set', function () {
        var client = new gavagai.RestClient('x');
        client.apiVersion.should.equal('v3')
    });

});

describe('The gavagai module', function () {

    it('should provide shorthand use of rest client', function () {
        var fake_apiKey = 'this-is-a-fake-api-key';

        var client = require('../lib')(fake_apiKey);

        (client instanceof gavagai.RestClient).should.equal(true);
        client.apikey.should.equal(fake_apiKey);
    });

});