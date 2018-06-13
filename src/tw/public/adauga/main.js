var btn = document.getElementById('adaugaReteta');

btn.onclick = e => {
    e.preventDefault();

    var nume = document.getElementById('nume').value;
    var descriere = document.getElementById('descriere').value;
    var ingrediente = document.getElementById('ingrediente').value;
    var post = document.getElementById('post').value;
    var nivel = document.getElementById('nivel').value;
    var timp = document.getElementById('timp').value;
    var alimentatie = document.getElementById('alimentatieReg').value;
    var file = document.getElementById('file').files[0];

    var ingrediente2 = '';

    var ing = ingrediente.split('\n');
    for (let index = 0; index < ing.length - 1; index++) {
        const element = ing[index];
        
        ingrediente2 += element + ','
    }

    ingrediente2 += ing[ing.length - 1];

    function reqListener() {
        if (this.response === 'success') {
            window.location.href = '/';
        }
    }

    var form = new FormData(document.getElementById('form'));
    
    // get new XHR object
    var ajax = new XMLHttpRequest();

    // bind our event listener to the "load" event.
    // "load" is fired when the response to our request is completed and without error.
    ajax.addEventListener('load', reqListener);

    ajax.open('POST', '/adauga');

    var data = {
        nume: nume,
        descriere: descriere,
        ingrediente: ingrediente2,
        post: post,
        nivel: nivel,
        timp: timp,
        alimentatie: alimentatie
    }
    
    // send it off!
    ajax.send(form);
}