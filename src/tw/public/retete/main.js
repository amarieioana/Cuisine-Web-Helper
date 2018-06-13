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

function reqListener() {
    var data = JSON.parse(this.response);

    var parent = document.getElementById('box');

    for (let index = 0; index < data.retete.length; index++) {
        const reteta = data.retete[index];
        
        var container = document.createElement('div');
        container.classList = 'responsive';

        var gal = document.createElement('div');
        gal.classList = 'gallery';

        var a = document.createElement('a');
        a.href = `/reteta/${reteta.id}`;

        var img = document.createElement('img');
        img.src = reteta.image;
        img.style = 'width: 200; height: 200;';

        a.appendChild(img);

        var desc = document.createElement('div');
        desc.classList = 'desc';
        desc.innerText = reteta.nume;

        gal.appendChild(a);
        gal.appendChild(desc);

        container.appendChild(gal);

        parent.appendChild(container);
    }
}

// get new XHR object
var ajax = new XMLHttpRequest();

// bind our event listener to the "load" event.
// "load" is fired when the response to our request is completed and without error.
ajax.addEventListener('load', reqListener);

ajax.open('GET', '/getAllRetete');

// send it off!
ajax.send();