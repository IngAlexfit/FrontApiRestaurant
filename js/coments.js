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
                            const fecha = new Date(comentario.fecha);
  
                            const dia = fecha.getDate(); 
                            const mes = fecha.getMonth(); 
                            const year = fecha.getFullYear();                       
                           
                            const fechaFormateada = `${dia}/${mes+1}/${year}`;         
                            
                          
                            commentCard += '<p class="comment-fecha">' + fechaFormateada + '</p>';
                                               
                            commentCard += '<p class="comment-text">' + comentario.contenido + '</p>';
                            commentCard += '<p class="comment-text">' + comentario.likes + '</p>';
                            commentCard += '<button id="likeButton' + index + '" class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"/></svg></button>';
                            commentCard += '<p class="comment-text">' + comentario.dislikes + '</p>';
                            commentCard += '<button id="disLikeButton' + index + '" class="btn btn-danger rotate-icon"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"/></svg></button>';

                            commentCard += '</div>';
                            commentsSection.append(commentCard);

                            // Agregar un manejador de eventos al botón
                            document.getElementById('likeButton' + index).addEventListener('click', function () {
                                darLike(JSON.stringify(comentario.id).replace(/[\n\r]/g, "\\n"));
                            });

                            document.getElementById('disLikeButton' + index).addEventListener('click', function () {
                                darDisLike(JSON.stringify(comentario.id).replace(/[\n\r]/g, "\\n"));
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
function darDisLike(comentarioId) {
    // Obtener el token JWT del local storage
    var jwtToken = localStorage.getItem('jwtToken');

    // Comprobar si el token existe en el local storage
    if (!jwtToken) {
        alert('Usuario no autenticado'); 
        return;
    }

    // 
    $.ajax({
        url: 'https://restaurantsapi-dev-narf.2.us-1.fl0.io/api/Comentario/DarDisklike', 
        type: 'POST',
        data: (comentarioId),
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + jwtToken // Incluir el token JWT en los encabezados
        },
        success: function (data) {
            
            alert('DisLike Realizado con éxito');
            cargarComentarios();
        },
        error: function (error) {
            
            if (error.status === 400 && error.responseJSON.message === "El usuario ya ha dado disLike") {
                alert('Ya has dado un Dislike a este comentario');
            } else {
                alert('Error al dar dislike: ' + error.responseJSON.message);
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
