var WebhookParser = require('./webhookParser');

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