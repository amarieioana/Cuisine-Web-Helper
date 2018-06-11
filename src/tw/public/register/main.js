let email = document.getElementById('usernameReg');
let password = document.getElementById('passwordReg');
let password2 = document.getElementById('password2Reg');
let alimentatie = document.getElementById('alimentatieReg');
let post = document.getElementById('post');

let register = document.getElementById('register');

let boli=document.getElementById('boli');

register.onclick = event => {
    event.preventDefault();

    register.setAttribute('disabled', 'disabled');
    
    let boliarray = [];

    for (let index = 0; index < boli.selectedOptions.length; index++) {
        const element = boli.selectedOptions[index];
    
        boliarray.push(element.value);
    }
    

    if (email.value !== '' && password.value !== '' && password2.value !== '' && alimentatie.value !== '' && post.value !== '' && password.value === password2.value) {
        function reqListener() {
            if (this.response === 'success') {
                window.location.href = '/';
            } else {
                register.style = 'background: red';

                setTimeout(() => {
                    register.style = '';
                    register.removeAttribute('disabled');
                }, 1000);
            }
        }

        // get new XHR object
        var ajax = new XMLHttpRequest();

        // bind our event listener to the "load" event.
        // "load" is fired when the response to our request is completed and without error.
        ajax.addEventListener('load', reqListener);

        ajax.open('POST', '/register');

        var data = {
            email: email.value,
            password: password.value,
            alimentatie: alimentatie.value,
            post: post.value,
            boli: boliarray
        }
        

        // send it off!
        ajax.send(JSON.stringify(data));
    }
}