$('#loginForm').submit(function (e) {
    e.preventDefault();
    var formData = {
        username: $('#username').val(),
        password: $('#password').val()
    };

    $.ajax({
        url: 'https://restaurantsapi-dev-narf.2.us-1.fl0.io/api/Auth/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            // Almacenar el token JWT en el almacenamiento local del navegador
            localStorage.setItem('jwtToken', data.token);

            // Redirigir a la página de lista de restaurantes
            window.location.href = 'restaurant.html';
        },
        error: function (error) {
            alert('Nombre de usuario o contraseña incorrectos');
        }
    });
});