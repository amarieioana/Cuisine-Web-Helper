var http = require('http');
var fs = require('fs');

var host = 1234;
var hostname = '127.0.0.1';

var mysql = require('mysql');
var crypto = require("crypto-js");
var Cookies = require("cookies");

var Busboy = require('busboy');
var inspect = require('util').inspect;

var UrlPattern = require('url-pattern');

let main = (req, res) => {
//verificare cookie si redirectionare spre pagina home corespunzatoare
    if (req.url === '/' && req.method === 'GET') {
        var cookies = new Cookies(req, res, null);
        var cookie = cookies.get('userToken');

        if (cookie) {
            var con = mysql.createConnection({
                host: "127.0.0.1",
                user: "root",
                password: "password",
                database: 'tw',
                insecureAuth : true
            });
            con.connect();

            let getemail = `select email from logati where token like '${cookie}';`;

            con.query(getemail, function (err, data) {
                if (err) {
                    throw err;
                }
                //daca exista un user cu acel email verificam daca e admin sau nu si il ducem pe pagina corespunzatoare
                if (data.length > 0) {
                    let getadmin = `select * from users where email like '${data[0].email}';`;
                    
                    con.query(getadmin, function (err, data) {
                        if (err) {
                            throw err;
                        }

                        if (data.length > 0) {
                            
                            if (data[0].admin === 0) {
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
                                fs.readFile(__dirname + '/views/home/home-admin.html', 'utf8', function (err, text) {
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
                    })
                }
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
// recomandarea retetelor in functie de boala, alimentatie si post
    if (req.url === '/getMineRetete' && req.method === 'GET') {
        var cookies = new Cookies(req, res, null);
        var cookie = cookies.get('userToken');

        if (cookie) {
            var con = mysql.createConnection({
                host: "127.0.0.1",
                user: "root",
                password: "password",
                database: 'tw',
                insecureAuth : true
            });
            con.connect();

            var getEmail = `select email from logati where token like '${cookie}';`;

            con.query(getEmail, (err, data) => {
                if (data.length > 0) {
                    var email = data[0].email;

                    var userData = `select post, alimentatie from users where email like '${email}';`;

                    con.query(userData, (err, data) => {
                        if (data.length > 0) {
                            var alimentatie = data[0].alimentatie;
                            var post = data[0].post;

                            var getBoliUser = `select nume from boliuser where email like '${email}';`;

                            var boliUser = []; 
                            var reteteTot = [];
                            var allRetete = [];

                            con.query(getBoliUser, (err, data) => {
                                if (data.length > 0) {
                                    for (let index = 0; index < data.length; index++) {
                                        const element = data[index];
                                        
                                        boliUser.push(element.nume);
                                    }

                                    var getRetete = `select * from retete where alimentatie like '${alimentatie}' and post like '${post}';`;

                                    con.query(getRetete, (err, data) => {
                                        if (data.length > 0) {

                                            for (let index = 0; index < data.length; index++) {
                                                const element = data[index];

                                                allRetete.push({
                                                    id: element.id,
                                                    nume: element.nume,
                                                    image: element.image
                                                })
                                                
                                                var getBoliRetete = `select nume from boliretete where id_reteta like '${element.id}';`;

                                                con.query(getBoliRetete, (err, data) => {
                                                    if (data.length > 0) {
                                                        var boliRetete = [];
                                                        
                                                        for (let index = 0; index < data.length; index++) {
                                                            const element = data[index];
                                                            
                                                            boliRetete.push(element.nume);
                                                        }

                                                        var ok = true;

                                                        for (let index = 0; index < boliRetete.length; index++) {
                                                            const bR = boliRetete[index];
                                                            
                                                            for (let index = 0; index < boliUser.length; index++) {
                                                                const bU = boliUser[index];

                                                                if (bR === bU) {
                                                                    ok = false;
                                                                }
                                                            }
                                                        }
                                                        if (ok) {
                                                            reteteTot.push({
                                                                id: element.id,
                                                                nume: element.nume,
                                                                image: element.image
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                            
                                            setTimeout(() => {
                                               if (reteteTot.length === 0) {
                                                res.writeHead(200, {
                                                    'Content-Type': 'text/plain'
                                                });
                                                res.end(JSON.stringify({
                                                    retete: allRetete
                                                }));
                                               } else {
                                                res.writeHead(200, {
                                                    'Content-Type': 'text/plain'
                                                });
                                                res.end(JSON.stringify({
                                                    retete: reteteTot
                                                }));
                                               }
                                            }, 1000);

                                        }
                                    });
                                    
                                }
                            });
                        }
                    });
                }
            });
        }
    }
//insert in tabela comentarii 
    if (req.url === '/addComentariu' && req.method === 'POST') {
        req.on('data', data => {
            var cookies = new Cookies(req, res, null);
            var cookie = cookies.get('userToken');

            var dataUser = JSON.parse(data);
    
            if (cookie) {
                var con = mysql.createConnection({
                    host: "127.0.0.1",
                    user: "root",
                    password: "password",
                    database: 'tw',
                    insecureAuth : true
                });
                con.connect();
    
                var getEmail = `select email from logati where token like '${cookie}';`;

                con.query(getEmail, (err, data) => {
                    if (data.length > 0) {
                        var email = data[0].email;

                        var getId = `select id from users where email like '${email}';`;

                        con.query(getId, (err, data) => {
                            
                            if (data.length > 0) {
                                var insert = `insert into comentarii (id_user, id_reteta, descriere) values ('${data[0].id}', '${dataUser.postId}', '${dataUser.descriere}');`;

                                con.query(insert, (err, data) => {
                                    if (data) {
                                        res.writeHead(200, {
                                            'Content-Type': 'text/plain'
                                        });
                                        res.end('success');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    }
//admin-ul primeste toate retetele
    if (req.url === '/getAllRetete' && req.method === 'GET') {
        var con = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "password",
            database: 'tw',
            insecureAuth : true
        });
        con.connect();

        var get = `select * from retete;`;

        var dataToSend = [];

        con.query(get, (err, data) => {
            if (data.length > 0) {
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];

                    var reteta = {
                        id: element.id,
                        nume: element.nume,
                        image: element.image
                    }
                    
                    dataToSend.push(reteta);
                }
                
                var send = {
                    retete: dataToSend
                };

                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end(JSON.stringify(send));
            }
        });
    }

//redirectionare spre pagina retetei
    var reteta = new UrlPattern('/reteta/:id');

    if (reteta.match(req.url) && req.method === 'GET') {
        var cookies = new Cookies(req, res, null);
        var cookie = cookies.get('userToken');

        if (cookie) {
            fs.readFile(__dirname + '/views/reteta/reteta.html', 'utf8', function (err, text) {
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
//comentarii pentru o anumita reteta
    var comentarii = new UrlPattern('/getComentarii/:id');

    if (comentarii.match(req.url) && req.method === 'GET') {
        var postId = comentarii.match(req.url).id;

        var con = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "password",
            database: 'tw',
            insecureAuth : true
        });
        con.connect();

        var getComentarii = `select * from comentarii where id_reteta = ${postId};`;

        con.query(getComentarii, (err, data) => {
            if (data.length > 0) {
                var comentarii = [];

                for (let index = 0; index < data.length; index++) {
                    const comentariu = data[index];
                    
                    var user = `select email from users where id = ${comentariu.id_user};`;

                    con.query(user, (err, data) => {
                        if (data.length > 0) {
                           var email = data[0].email;

                           var coment = comentariu.descriere;
                            
                           comentarii.push({
                               email: email,
                               descriere: coment
                           });
                           
                        }
                    });
                }

                setTimeout(() => {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(JSON.stringify(comentarii));
                }, 1000);
                
            }
        });
    }

//toate informatiile pentru pagina unei retete
    var retetaGet = new UrlPattern('/reteta/get/:id');

    if (retetaGet.match(req.url) && req.method === 'GET') {
        var cookies = new Cookies(req, res, null);
        var cookie = cookies.get('userToken');

        if (cookie) {
            var con = mysql.createConnection({
                host: "127.0.0.1",
                user: "root",
                password: "password",
                database: 'tw',
                insecureAuth : true
            });
            con.connect();

            var idReteta = retetaGet.match(req.url).id;
            
            var sql = `select * from retete where id = ${idReteta};`;

            con.query(sql, (err, data) => {
                if (data.length > 0) {
                    var element = data[0];
                    var dataToSend = {
                        nume: element.nume,
                        descriere: element.descriere,
                        ingrediente: element.ingrediente,
                        post: element.post,
                        nivel: element.nivel,
                        timp: element.timp,
                        alimentatie: element.alimentatie,
                        image: element.image
                    };

                    var boli = `select nume from boliretete where id_reteta = ${element.id};`;

                    con.query(boli, (err, data) => {
                        if (data) {
                            var boliReteta = [];

                            for (let index = 0; index < data.length; index++) {
                                const element = data[index];
                                
                                boliReteta.push(element.nume);
                            }

                            var send = {
                                reteta: dataToSend,
                                boli: boliReteta
                            };

                            res.writeHead(200, {
                                'Content-Type': 'text/plain'
                            });
                            res.end(JSON.stringify(send));
                        }
                    });

                    
                }
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

    if (req.url.includes('.jpeg') && req.method === 'GET') {
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
                password: "password",
                database: 'tw',
                insecureAuth : true
            });
            con.connect();

            let user = JSON.parse(data);

            let password = crypto.SHA512(user.password).toString();

            let sql = `select * from users where email like '${user.email}' and password like '${password}';`;
            
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

                    let createLogati = `insert into logati (token, email) values ('${token}', '${user.email}');`;

                    con.query(createLogati, (err, data) => {
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
                password: "password",
                database: 'tw',
                insecureAuth : true
            });
            con.connect();

            let deleteCookie = `delete from logati where token like '${cookie}';`;

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
                password: "password",
                database: 'tw',
                insecureAuth : true
            });
            con.connect();

            let user = JSON.parse(data);

            let varifyEmail = `select * from users where email like '${user.email}';`;

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

                    let createUser = `insert into users (email, password, alimentatie, post) values ('${user.email}', '${password}', '${user.alimentatie}', '${user.post}');`;
                    
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

                            let createLogati = `insert into logati (token, email) values ('${token}', '${user.email}');`;
                            
                            con.query(createLogati, (err, data) => {
                                if (err) {
                                    throw err;
                                }

                                if (data) {
                                    if (user.boli.length > 0) {
                                        for (let index = 0; index < user.boli.length; index++) {
                                            const element = user.boli[index];
                                            
                                            let addBoli = `insert into boliuser (nume, email) values ('${element}', '${user.email}');`;
                                            
                                            con.query(addBoli, function (err ,data) {
                                                if (err) {
                                                    throw err;
                                                }
                                            });
                                        }

                                        res.writeHead(200, {
                                            'Content-Type': 'text/plain'
                                        });
                                        res.end('success');
                                    } else {
                                        res.writeHead(200, {
                                            'Content-Type': 'text/plain'
                                        });
                                        res.end('success');
                                    }
                                } else {
                                    res.writeHead(200, {
                                        'Content-Type': 'text/plain'
                                    });
                                    res.end('error');
                                }
                            });

                            
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
//redirectionare pagina retete
let retete = function (req, res) {
    if (req.url === '/retete' && req.method === 'GET') {
        fs.readFile(__dirname + '/views/retete/retete.html', 'utf8', function (err, text) {
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
//intai redirectionare spre pagina de adaugare reteta, apoi adaugarea efectiva 
let adauga = function (req, res) {
    if (req.url === '/adauga' && req.method === 'GET') {
        var cookies = new Cookies(req, res, null);
        var cookie = cookies.get('userToken');

        if (cookie) {
            var con = mysql.createConnection({
                host: "127.0.0.1",
                user: "root",
                password: "password",
                database: 'tw',
                insecureAuth : true
            });
            con.connect();

            let getemail = `select email from logati where token like '${cookie}';`;

            con.query(getemail, function (err, data) {
                if (err) {
                    throw err;
                }

                if (data.length > 0) {
                    let getadmin = `select * from users where email like '${data[0].email}';`;
                    
                    con.query(getadmin, function (err, data) {
                        if (err) {
                            throw err;
                        }

                        if (data.length > 0) {
                            
                            if (data[0].admin === 1) {
                                fs.readFile(__dirname + '/views/adauga/adauga.html', 'utf8', function (err, text) {
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
                    });
                }
            });
        }
    }
//adauga reteta in baza de date
    if (req.url === '/adauga' && req.method === 'POST') {
        var busboy = new Busboy({ headers: req.headers });

        var name = '';
        var descriere = '';
        var ingrediente = '';
        var post = '';
        var nivel = '';
        var timp = '';
        var alimentatie = '';
        var bolir = [];

        var filePath = '';

        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            switch (fieldname) {
                case 'nume':
                    name = inspect(val);
                    break;

                case 'boli[]':
                bolir.push(inspect(val).split(`'`)[1]);
                break;
                
                case 'descriere':
                    descriere = inspect(val);
                    break;

                case 'ingrediente':
                    ingrediente = inspect(val);
                    break;
                
                case 'post':
                post = inspect(val);
                break;

                case 'nivel':
                nivel = inspect(val);
                break;

                case 'timp':
                timp = inspect(val);
                break;

                case 'alimentatie':
                alimentatie = inspect(val);
                break;

                default:
                    break;
            }
        });
        
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            var type = mimetype.split('/')[1];

            filePath = '/public/reteteImages/' + crypto.SHA256(new Date().toString()).toString() + `.${type}`;
        
            var saveTo = __dirname + filePath;
            file.pipe(fs.createWriteStream(saveTo));
        });

        busboy.on('finish', function() {
            var con = mysql.createConnection({
                host: "127.0.0.1",
                user: "root",
                password: "password",
                database: 'tw',
                insecureAuth : true
            });
            con.connect();

            var insert = `insert into retete (nume, descriere, ingrediente, post, nivel, timp, alimentatie, image) values (${name}, ${descriere}, ${ingrediente}, ${post}, ${nivel}, ${timp}, ${alimentatie}, '${filePath}');`;
            
            con.query(insert, (err, data) => {

                if (data) {
                    var retetaId = data.insertId;
                    
                    for (let index = 0; index < bolir.length; index++) {
                        const element = bolir[index];
                        
                        var boli = `insert into boliretete (nume, id_reteta) values ('${element}', '${retetaId}');`;
                        con.query(boli, (err, data) => {
                            
                        });
                    }

                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('success');
                }
            });
        });
        req.pipe(busboy);
    }
}

http.createServer((req, res) => {
    assets(req, res);
    login(req, res);
    logout(req, res);
    register(req, res);
    despre(req, res);

    retete(req, res);

    adauga(req, res);

    main(req, res);

}).listen(host, hostname, () => console.log(`Server started at http://${hostname}:${host}`));