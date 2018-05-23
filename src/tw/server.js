var http = require('http');
var fs = require('fs');

var host = 1234;
var hostname = '127.0.0.1';

http.createServer(function (req, res) {

    if (req.url.includes('.css') && req.method === 'GET') {
        fs.readFile(__dirname + req.url, 'utf8', function(err, text){
            if (err) {
                throw err;
            }
    
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end(text);
        });
        
    }

    if (req.url.includes('.js') && req.method === 'GET') {
        fs.readFile(__dirname + req.url, 'utf8', function(err, text){
            if (err) {
                throw err;
            }
    
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.end(text);
        });
        
    }


    if (req.url.includes('.png') && req.method === 'GET') {
        fs.readFile(__dirname + req.url, 'utf8', function(err, text){
            if (err) {
                throw err;
            }
    
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(text);
        });
        
    }

    if (req.url.includes('.jpg') && req.method === 'GET') {
        fs.readFile(__dirname + req.url, 'utf8', function(err, text){
            if (err) {
                throw err;
            }
    
            res.writeHead(200, {'Content-Type': 'image/jpg'});
            res.end(text);
        });
        
    }

    if (req.url.includes('.svg') && req.method === 'GET') {
        fs.readFile(__dirname + req.url, 'utf8', function(err, text){
            if (err) {
                throw err;
            }
    
            res.writeHead(200, {'Content-Type': 'image/svg'});
            res.end(text);
        });
        
    }

  if (req.url === '/' && req.method === 'GET') {

    fs.readFile(__dirname + '/views/home/home.html', 'utf8', function(err, text){
        if (err) {
            throw err;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(text);
    });

    
  }
}).listen(host, hostname, () => console.log(`Server started at http://${hostname}:${host}`));