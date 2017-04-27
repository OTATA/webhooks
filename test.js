var assert = require('assert');
var mockery = require('mockery');

var WebhookParser = require('./webhookParser');

describe("webhook parser", function () {

    it('top url', function (done) {
        var webhookParser = new WebhookParser('test.txt');
        var expects = [];
        expects.push({'https://woodenoyster.com.br' : 3});
        expects.push({'https://grimpottery.net.br': 2});
        expects.push({'https://grotesquemoon.de' : 1});

        webhookParser.getTopUrl(3, function (result) {
            assert.deepEqual(result, expects);
            done();
        });
    });
    
    it('table of status', function (done) {
        var webhookParser = new WebhookParser('test.txt');
        webhookParser.getStatusTable(function (result) {
            assert.deepEqual(result, { '200': 1, '201': 1, '400': 3, '404': 3, '500': 2, '503': 1 });
            done();
        });
    });
});
