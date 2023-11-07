var jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
            // Redirigir al usuario a la página de inicio de sesión si no está autenticado
            window.location.href = 'restaurants.html';
        }

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
            window.location.href = 'restaurants.html';
        },
        error: function (error) {
            alert('Nombre de usuario o contraseña incorrectos');
        }
    });
});
