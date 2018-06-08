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