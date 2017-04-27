"use strict";

var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var WebhookParser = (function () {

    function WebhookParser(fileName) {
        this.fileName = fileName;
        this.fileParsed = null;
        this.status = null;
    }
    
    WebhookParser.setStatus = function(status) {
        this.status = status;
    };
    
    WebhookParser.getStatus = function() {
        return this.status;
    };
    
    WebhookParser.seFileParsed = function(fileParsed) {
        this.fileParsed = fileParsed;
    };
    
    function parse(fileName, callback) {
        var data = [];
        var instream = fs.createReadStream(fileName);
        var outstream = new stream;
        var readLine = readline.createInterface(instream, outstream);
        var status = {};
        
        readLine.on('line', function (line) {

            var lineObject = line.split(" ");
            var url = lineObject[2].replace(/request_to|=|"/g, '');
            var statusString = lineObject[lineObject.length - 1].replace(/response_status|=|"/g, '');
            status = parseStatus(statusString.trim(), status);
            
            if (data[url]) {
                data[url] += 1;
            } else {
                data[url] = 1;
            }
        }).on('close', function () {
            WebhookParser.setStatus(status);
            WebhookParser.seFileParsed(data);
            callback(data);
        });
    };
    
    function parseStatus(status, arrayStatus) {
        if (arrayStatus[status]) {
            arrayStatus[status] += 1;
        } else {
            arrayStatus[status] = 1;
        }

        return arrayStatus;
    };

    WebhookParser.prototype.getTopUrl = function (top, callback) {
        parse(this.fileName, function(result) {
            
            var topUrl = [];
            var keys = Object.keys(result),
            i, len = keys.length;
            keys.sort(function(a,b){return result[b]-result[a]});
            if (top > len) {
                top = len;
            }
            for (var i = 0;i<top;i++) {
                var url = [];
                url[keys[i]] = result[keys[i]];
                topUrl.push(url);
            }
            callback(topUrl);
        });
    };
    WebhookParser.prototype.getStatusTable = function (callback) {
        if (!this.fileParsed) {
            parse(this.fileName, function() {
                callback(WebhookParser.getStatus());
            });
            return;
        }
        callback(WebhookParser.getStatus());
    };
    
    return WebhookParser;

})();

module.exports = WebhookParser;

var args = process.argv.slice(2);
var fileName = args[0];
var webhookParser = new WebhookParser(fileName);

webhookParser.getTopUrl(3, function(result) {
    var top;
    for(top in result) {
        var key = Object.keys(result[top]);
        process.stdout.write('Url: ' + key[0] + ' - Total: ' + result[top][key[0]]);
        process.stdout.write('\n');
    }
});

webhookParser.getStatusTable(function(result) {
    var status;
    for(status in result) {
        process.stdout.write('Status: ' + status + ' - Total: ' + result[status]);
        process.stdout.write('\n');
    }
});
