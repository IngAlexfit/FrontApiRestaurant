cargarComentarios();
function cargarComentarios() {
    var restauranteId = obtenerRestauranteIdDeLaURL();

    // Primero, obtén los detalles del restaurante
    $.ajax({
        url: 'https://restaurantsapi-dev-narf.2.us-1.fl0.io/api/Restaurant/' + restauranteId,
        type: 'GET',
        dataType: 'json',
        success: function (restaurante) {
            // Muestra los detalles del restaurante
            mostrarDetallesDelRestaurante(restaurante);

            // Luego, carga los comentarios
            $.ajax({
                url: 'https://restaurantsapi-dev-narf.2.us-1.fl0.io/api/Comentario/ByRestauranteId/' + restauranteId,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    var commentsSection = $('#commentsSection');
                    commentsSection.empty();
                    if (data.length > 0) {
                        data.forEach(function (comentario, index) {
                            var commentCard = '<div class="comment-card">';
                            commentCard += '<p class="comment-author">' + comentario.autor + '</p>';
                            commentCard += '<p class="comment-text">' + comentario.contenido + '</p>';
                            commentCard += '<p class="comment-text">' + comentario.likes + '</p>';
                            commentCard += '<button id="likeButton' + index + '">Like</button>';
                            commentCard += '</div>';
                            commentsSection.append(commentCard);

                            // Agregar un manejador de eventos al botón
                            document.getElementById('likeButton' + index).addEventListener('click', function () {
                                darLike(JSON.stringify(comentario.id).replace(/[\n\r]/g, "\\n"));
                            });
                        });

                    } else {
                        commentsSection.append('<p>No hay comentarios disponibles.</p>');
                    }
                },
                error: function () {
                    alert('Error al cargar los comentarios.');
                }
            });
        },
        error: function () {
            alert('Error al cargar los detalles del restaurante.');
        }
    });
}

function mostrarDetallesDelRestaurante(restaurante) {
    $('#restaurant-title').text('Detalles del Restaurante');
    $('#restaurant-image').attr('src', restaurante.imagenUrl);
    $('#restaurant-name').text('Nombre del Restaurante: ' + restaurante.nombre);
    $('#restaurant-location').text('Ubicación: ' + restaurante.ubicacion);
    $('#restaurant-cuisine').text('Tipo de Cocina: ' + restaurante.tipoCocina);
    $('#restaurant-description').text('Descripción: ' + restaurante.descripcion);
}


// Función para dar like a un comentario


function obtenerRestauranteIdDeLaURL() {
    // Obtiene la URL actual
    var url = window.location.href;

    // Busca la cadena "?id=" en la URL
    var index = url.indexOf('?id=');

    if (index !== -1) {
       
        var idStartIndex = index + 4; // Longitud de "?id=" es 4

        // Obtiene el ID como una cadena
        var idString = url.substring(idStartIndex);

        // Convierte el ID a un número entero
        var restauranteId = parseInt(idString, 10);

        if (!isNaN(restauranteId)) {
            return restauranteId;
        }
    }

   
    return null;
}
function darLike(comentarioId) {
    // Obtener el token JWT del local storage
    var jwtToken = localStorage.getItem('jwtToken');

    // Comprobar si el token existe en el local storage
    if (!jwtToken) {
        alert('Usuario no autenticado'); 
        return;
    }

    // 
    $.ajax({
        url: 'https://restaurantsapi-dev-narf.2.us-1.fl0.io/api/Comentario/IncrementarLike', 
        type: 'POST',
        data: (comentarioId),
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + jwtToken // Incluir el token JWT en los encabezados
        },
        success: function (data) {
            
            alert('Like incrementado con éxito');
            cargarComentarios();
        },
        error: function (error) {
            
            if (error.status === 400 && error.responseJSON.message === "El usuario ya ha dado like") {
                alert('Ya has dado like a este comentario');
            } else {
                alert('Error al incrementar el like: ' + error.responseJSON.message);
            }
        }
    });

}


function agregarComentario() {
    // Obtener el contenido del comentario desde el campo de texto
    const contenidoComentario = document.getElementById("newComment").value;

    // Verificar si se ha ingresado contenido
    if (contenidoComentario.trim() === "") {
        alert("Por favor, escribe tu comentario antes de enviar.");
        return;
    }

    // Obtener el token JWT del localStorage
    const jwtToken = localStorage.getItem("jwtToken");

    // Verificar si se ha almacenado un token
    if (!jwtToken) {
        alert("No hay un token JWT almacenado.");
        return;
    }
    var restauranteId = obtenerRestauranteIdDeLaURL();

    var jwtPayload = jwtToken.split('.')[1];
        var decodedJwt = atob(jwtPayload);
        var username = JSON.parse(decodedJwt).unique_name;
   
    const comentarioData = {
        contenido: contenidoComentario,
        autor: username,
        restaurante_id:restauranteId
    };

   
    $.ajax({
        url: 'https://restaurantsapi-dev-narf.2.us-1.fl0.io/api/Comentario/agregar-comentario',
        type: 'POST',
        data: JSON.stringify(comentarioData),
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        },
        success: function (data) {
            
            cargarComentarios();
            alert('Comentario agregado con éxito');
            $('#newComment').val('');

        },
        error: function (error) {
           
            alert('Error al agregar el comentario: ' + error.responseJSON.message);
        }
    });
}
