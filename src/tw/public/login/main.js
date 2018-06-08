let username = document.getElementById('username');
let password = document.getElementById('password');
let login = document.getElementById('login');

login.onclick = function (event) {
    event.preventDefault();

    login.setAttribute('disabled', 'disabled');

    let err = document.getElementById('err');
    err.innerText = '';

    if (username.value !== '' && password.value !== '') {
        // get new XHR object
        let ajax = new XMLHttpRequest();

        // bind our event listener to the "load" event.
        // "load" is fired when the response to our request is completed and without error.
        ajax.addEventListener('load', function () {
            if (this.response === 'success') {
                window.location.href = '/';
            } else {
                login.style = 'background: red';

                err.innerText = 'Date invalide';
                err.style = 'color: red;';

                setTimeout(() => {
                    login.style = '';
                    login.removeAttribute('disabled');
                    err.innerText = '';
                }, 1000);
            }
        });

        ajax.open('POST', '/login');

        let data = {
            email: username.value,
            password: password.value
        }

        // send it off!
        ajax.send(JSON.stringify(data));
    }
}