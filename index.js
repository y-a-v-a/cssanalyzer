var http = require('http');
var fs = require('fs');


var cssData = JSON.parse(fs.readFileSync('data.json'));

var server = http.createServer(function(req, res) {
    if (req.url === '/') {
        var dataFile = fs.readFileSync('data.html').toString('utf8');
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(dataFile.replace('\{\{XXX\}\}', JSON.stringify(cssData)));
    } else if (req.url === '/analyzer.js') {
        res.writeHead(200, {'Content-Type':'application/javascript'});
        res.end(fs.readFileSync('analyzer.js'));
    } else if (req.url === '/post') {
        req.on('data', function(data) {
            var data = JSON.parse(data.toString('utf8'));
            parseCSSSelectors(data);
            res.writeHead(200, {'Content-type': 'text/plain'});
            res.end('ok');
        });
    } else {
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.end('not found');
    }
});

server.listen(1337, '127.0.0.1');

function parseCSSSelectors(data) {
    for (var i = 0; i < data.length; i++) {
        updateData(data[i]);
    }
}
function save() {
    var dataString = JSON.stringify(cssData);
    fs.writeFileSync('data.json', dataString);
    process.exit();
}

function updateData(element) {
    if (element === null) {
        return;
    }
    var present = false;
    for (var r = 0; r < cssData.length; r++) {
        if (cssData[r].selector === element.selector) {
            present = true;
            cssData[r].count = element.count;
        }
    }
    if (present === false) {
        cssData.push(element);
    }
    console.log(cssData);
}

process.on('SIGINT', save);