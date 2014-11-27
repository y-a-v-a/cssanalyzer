/* globals require, console, process */
var http = require('http');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

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
            try {
                var jsonString = data.toString('utf8');
                var jsonData = JSON.parse(jsonString);
                parseCSSSelectors(jsonData);
            } catch(e) {
                console.log(e);
            }
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
    doneListener.emit('save');
}
function save() {
    console.log(new Date().toISOString() + ' saving...');
    var dataString = JSON.stringify(cssData);
    fs.writeFileSync('data.json', dataString);
    // process.exit();
}

function updateData(element) {
    if (element === null) {
        return;
    }
    var present = false;
    for (var r = 0; r < cssData.length; r++) {
        if (cssData[r].selector === element.selector) {
            present = true;
            cssData[r].count = cssData[r].count + element.count;
            if (element.count > 0) {
                cssData[r].href.push(element.href.pop());
            }
            if (element.subselectors) {
                for (var j = 0; j < element.subselectors.length; j++) {
                    cssData[r].subselectors[j].count = cssData[r].subselectors[j].count + element.subselectors[j].count;
                }
            }
        }
    }
    if (present === false) {
        cssData.push(element);
    }
}


var doneListener = new EventEmitter();

doneListener.on('save', function() {
    save();
});

//process.on('SIGINT', save);