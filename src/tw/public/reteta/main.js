let log = document.getElementById('logOut');

log.onclick = function () {
    function reqListener() {
        if (this.response === 'success') {
            window.location.href = '/';
        }
    }

    // get new XHR object
    var ajax = new XMLHttpRequest();

    // bind our event listener to the "load" event.
    // "load" is fired when the response to our request is completed and without error.
    ajax.addEventListener('load', reqListener);

    ajax.open('GET', '/logout');

    // send it off!
    ajax.send();
}

// get new XHR object
var ajax = new XMLHttpRequest();

function reqListener() {
    var data = JSON.parse(this.response);

    var parent = document.getElementById('bod');

    var row = document.createElement('div');
    row.classList = 'row';

    var side = document.createElement('div');
    side.classList = 'side';

    var h1 = document.createElement('h2');
    h1.innerText = 'Ingerdiente';

    var pre = document.createElement('pre');
    pre.innerText = data.reteta.ingrediente;

    side.appendChild(h1);
    side.appendChild(pre);

    var h2 = document.createElement('h4');
    h2.innerText = 'Timp de preparare';

    var p = document.createElement('p');
    p.innerText = data.reteta.timp + ' minute';

    side.appendChild(h2);
    side.appendChild(p);

    h2 = document.createElement('h4');
    h2.innerText = 'Nivel dificultate';

    
    p = document.createElement('p');

    switch (data.reteta.nivel) {
        case 1:
        p.innerText = 'Usor';
            break;

            case 2:
            p.innerText = 'Mediu';
                break;

                case 3:
                p.innerText = 'Greu';
                    break;
    
        default:
            break;
    }

    side.appendChild(h2);
    side.appendChild(p);

    h2 = document.createElement('h4');
    h2.innerText = 'Alimetatie';

    p = document.createElement('p');

    switch (data.reteta.alimentatie) {
        case 'fara':
        p.innerText = 'Fara restrictii alimentare'
            break;
    
        default:
        p.innerText = data.reteta.alimentatie;
            break;
    }

    side.appendChild(h2);
    side.appendChild(p);

    h2 = document.createElement('h4');
    h2.innerText = 'Post';

    p = document.createElement('p');

    switch (data.reteta.post) {
        case 0:
        p.innerText = 'Nu';
            break;
            case 1:
            p.innerText = 'Da';
                break;
    
        default:
            break;
    }

    side.appendChild(h2);
    side.appendChild(p);

    h2 = document.createElement('h4');
    h2.innerText = 'Boli';

    side.appendChild(h2);

    for (let index = 0; index < data.boli.length; index++) {
        const element = data.boli[index];
        
        var text = element.split('_');

        var text2 = '';

        for (let index = 0; index < text.length; index++) {
            const element = text[index];
            
            text2 += element + ' ';
        }

        var text3 = text2.charAt(0).toUpperCase() + text2.substr(1);
        p = document.createElement('p');
        p.innerText = text3;
        side.appendChild(p);
    }

    row.appendChild(side);

    var main = document.createElement('div');
    main.classList = 'main';
    
    var h = document.createElement('h2');
    h.innerText = data.reteta.nume;

    main.appendChild(h);

    var div = document.createElement('div');
    var img = document.createElement('img');
    img.src = data.reteta.image;
    img.style = 'margin-bottom: 15px;';
    
    div.appendChild(img);

    main.appendChild(img);

    var descriere = document.createElement('pre');
    descriere.innerText = data.reteta.descriere;

    main.appendChild(descriere);

    row.appendChild(main);

    parent.appendChild(row);
}

// bind our event listener to the "load" event.
// "load" is fired when the response to our request is completed and without error.
ajax.addEventListener('load', reqListener);

var url = window.location.href.split('/')[window.location.href.split('/').length - 1];

ajax.open('GET', `/reteta/get/${url}`);

// send it off!
ajax.send();

var send = document.getElementById('sendComent');

send.onclick = () => {
    var ajax = new XMLHttpRequest();

    function reqListener2() {
        if (this.response === 'success') {
            window.location.href = window.location.href;
        }
    }

    // bind our event listener to the "load" event.
    // "load" is fired when the response to our request is completed and without error.
    ajax.addEventListener('load', reqListener2);

    var url = window.location.href.split('/')[window.location.href.split('/').length - 1];

    ajax.open('POST', '/addComentariu');
    var inp =document.getElementById('comentariu').value;

    var data = {
        postId: url,
        descriere: inp
    }

    // send it off!
    ajax.send(JSON.stringify(data));
}

var ajax2 = new XMLHttpRequest();

function reqListener2() {
    var data = JSON.parse(this.response);

    var parent = document.getElementById('contentComentarii');

    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        
        var h4 = document.createElement('h4');
        h4.innerText = element.email;

        var p = document.createElement('p');
        p.innerText = element.descriere;

        parent.appendChild(h4);
        parent.appendChild(p);
    }
    
}

// bind our event listener to the "load" event.
// "load" is fired when the response to our request is completed and without error.
ajax2.addEventListener('load', reqListener2);

var url = window.location.href.split('/')[window.location.href.split('/').length - 1];

ajax2.open('GET', `/getComentarii/${url}`);

// send it off!
ajax2.send();
