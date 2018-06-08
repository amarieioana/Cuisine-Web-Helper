var http = require('http');
var fs = require('fs');

var host = 1234;
var hostname = '127.0.0.1';

var mysql = require('mysql');
var crypto = require("crypto-js");
var Cookies = require("cookies");

let main = (req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        var cookies = new Cookies(req, res, null);
        var cookie = cookies.get('userToken');

        if (cookie) {
            fs.readFile(__dirname + '/views/home/home-log.html', 'utf8', function (err, text) {
                if (err) {
                    throw err;
                }

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(text);
            });
        } else {
            fs.readFile(__dirname + '/views/home/home.html', 'utf8', function (err, text) {
                if (err) {
                    throw err;
                }

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(text);
            });
        }
    }
}

let assets = (req, res) => {
    if (req.url.includes('.css') && req.method === 'GET') {
        fs.readFile(__dirname + req.url, 'utf8', function (err, text) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                'Content-Type': 'text/css'
            });
            res.end(text);
        });

    }

    if (req.url.includes('.js') && req.method === 'GET') {
        fs.readFile(__dirname + req.url, 'utf8', function (err, text) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                'Content-Type': 'text/javascript'
            });
            res.end(text);
        });

    }


    if (req.url.includes('.png') && req.method === 'GET') {
        fs.readFile(__dirname + req.url, function (err, text) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                'Content-Type': 'image/png'
            });
            res.end(text);
        });

    }

    if (req.url.includes('.jpg') && req.method === 'GET') {
        fs.readFile(__dirname + req.url, function (err, text) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                'Content-Type': 'image/jpg'
            });
            res.end(text);
        });

    }

    if (req.url.includes('.svg') && req.method === 'GET') {
        fs.readFile(__dirname + req.url, function (err, text) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                'Content-Type': 'image/svg'
            });
            res.end(text);
        });

    }
}

let login = (req, res) => {
    if (req.url === '/login' && req.method === 'GET') {
        fs.readFile(__dirname + '/views/login/login.html', 'utf8', function (err, text) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(text);
        });
    }

    if (req.url === '/login' && req.method === 'POST') {
        req.on('data', function (data) {
            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: 'tw'
            });
            con.connect();

            let user = JSON.parse(data);

            let password = crypto.SHA512(user.password).toString();

            let sql = `select * from Users where email like '${user.email}' and password like '${password}';`;

            con.query(sql, function (err, data) {
                if (err) {
                    throw err;
                }

                if (data.length > 0) {
                    var cookies = new Cookies(req, res, null);

                    let token = crypto.SHA512(user.email).toString();

                    cookies.set('userToken', token, {
                        maxAge: 1000 * 60 * 60 * 12
                    });

                    let creteLogati = `insert into Logati (token, email) values ('${token}', '${user.email}');`;

                    con.query(creteLogati, (err, data) => {
                        if (err) {
                            throw err;
                        }

                        if (data) {
                            res.writeHead(200, {
                                'Content-Type': 'text/plain'
                            });
                            res.end('success');
                        } else {
                            res.writeHead(200, {
                                'Content-Type': 'text/plain'
                            });
                            res.end('error');
                        }
                    });

                    con.end();
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('error');
                }
            });
        });
    }
}

let logout = (req, res) => {
    if (req.url === '/logout' && req.method === 'GET') {
        var cookies = new Cookies(req, res, null);
        var cookie = cookies.get('userToken');

        if (cookie) {
            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: 'tw'
            });
            con.connect();

            let deleteCookie = `delete from Logati where token like '${cookie}';`;

            con.query(deleteCookie, function (err, data) {
                if (err) {
                    throw err;
                }

                cookies.set('userToken', null);

                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('success');
            });
        }
    }
}

let register = (req, res) => {
    if (req.url === '/register' && req.method === 'GET') {
        var cookies = new Cookies(req, res, null);
        var cookie = cookies.get('userToken');

        if (cookie) {
            fs.readFile(__dirname + '/views/home/home-log.html', 'utf8', function (err, text) {
                if (err) {
                    throw err;
                }

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(text);
            });
        } else {
            fs.readFile(__dirname + '/views/register/register.html', 'utf8', function (err, text) {
                if (err) {
                    throw err;
                }

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(text);
            });
        }
    }

    if (req.url === '/register' && req.method === 'POST') {
        req.on('data', data => {
            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: 'tw'
            });
            con.connect();

            let user = JSON.parse(data);

            let varifyEmail = `select * from Users where email like '${user.email}';`;

            con.query(varifyEmail, function (err, data) {
                if (err) {
                    throw err;
                }

                if (data.length > 0) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('error');
                } else {
                    let password = crypto.SHA512(user.password).toString();

                    let createUser = `insert into Users (email, password, alimentatie, post) values ('${user.email}', '${password}', '${user.alimentatie}', '${user.post}');`;

                    con.query(createUser, (err, data) => {
                        if (err) {
                            throw err;
                        }

                        if (data) {
                            var cookies = new Cookies(req, res, null);

                            let token = crypto.SHA512(user.email).toString();

                            cookies.set('userToken', token, {
                                maxAge: 1000 * 60 * 60 * 12
                            });

                            let creteLogati = `insert into Logati (token, email) values ('${token}', '${user.email}');`;

                            con.query(creteLogati, (err, data) => {
                                if (err) {
                                    throw err;
                                }

                                if (data) {
                                    res.writeHead(200, {
                                        'Content-Type': 'text/plain'
                                    });
                                    res.end('success');
                                } else {
                                    res.writeHead(200, {
                                        'Content-Type': 'text/plain'
                                    });
                                    res.end('error');
                                }
                            });

                            con.end();
                        } else {
                            res.writeHead(200, {
                                'Content-Type': 'text/plain'
                            });
                            res.end('error');
                        }
                    });
                }
            });
        });
    }
}

let despre = (req, res) => {
    if (req.url === '/despre' && req.method === 'GET') {
        var cookies = new Cookies(req, res, null);
        var cookie = cookies.get('userToken');

        if (cookie) {
            fs.readFile(__dirname + '/views/despre/despre.html', 'utf8', function (err, text) {
                if (err) {
                    throw err;
                }

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(text);
            });
        } else {
            fs.readFile(__dirname + '/views/home/home.html', 'utf8', function (err, text) {
                if (err) {
                    throw err;
                }

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(text);
            });
        }
    }
}

http.createServer((req, res) => {
    assets(req, res);
    login(req, res);
    logout(req, res);
    register(req, res);
    despre(req, res);

    main(req, res);

}).listen(host, hostname, () => console.log(`Server started at http://${hostname}:${host}`));