
        // Verificar si hay un token JWT en el almacenamiento local
        var jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            // Redirigir al usuario a la página de inicio de sesión si no está autenticado
            window.location.href = 'index.html';
        }

        // Función para cargar la lista de restaurantes desde la API
        function loadRestaurantList(city) {
            $.ajax({
                url: 'https://restaurantsapi-dev-narf.2.us-1.fl0.io/api/Restaurant' + (city ? '/byCiudad/' + city : ''),
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + jwtToken
                },
                success: function (data) {
                    var restaurantList = $('#restaurantList');
                    var noResultsMessage = $('#noResultsMessage');
                    restaurantList.empty();
                    if (data.length > 0) {
                        // Mostrar los restaurantes encontrados en mosaico
                        noResultsMessage.hide();
                        data.forEach(function (restaurant) {
                            var restaurantCard = '<div class="restaurant-card">';
                            restaurantCard += '<a href="restaurant.html?id=' + restaurant.idRestaur + '">';
                            restaurantCard += '<img src="' + restaurant.imagenUrl + '"> </a>';
                            restaurantCard += '<div class="restaurant-details">';
                            restaurantCard += '<h5>' + restaurant.nombre + '</h5>';
                            restaurantCard += '<p>Ubicación: ' + restaurant.ubicacion + '</p>';
                            restaurantCard += '<p>Tipo de Cocina: ' + restaurant.tipoCocina + '</p>';
                            restaurantCard += '<p>Descripción: ' + restaurant.descripcion + '</p>';
                            restaurantCard += '<p>Visitas: ' + restaurant.visitas + '</p>';
                            restaurantCard += '<p>Likes: ' + restaurant.likes + '</p>';
                            restaurantCard += '</div></div>';
                            restaurantList.append(restaurantCard);
                        });
                    } else {
                        // Mostrar mensaje si no se encontraron resultados
                        noResultsMessage.show();
                    }
                },
                error: function () {
                    alert('Error al cargar la lista de restaurantes.');
                    let select = document.getElementById("citySelect");
                    select.value = "";  
                    loadRestaurantList();
                }
            });
        }

        // Llamar a la función para cargar la lista de restaurantes al cargar la página
        loadRestaurantList();

        function mostrarDetallesDelRestaurante(restaurante) {
            $('#restaurant-title').text('Detalles del Restaurante');
            $('#restaurant-image').attr('src', restaurante.imagenUrl);
            $('#restaurant-name').text('Nombre del Restaurante: ' + restaurante.nombre);
            $('#restaurant-location').text('Ubicación: ' + restaurante.ubicacion);
            $('#restaurant-cuisine').text('Tipo de Cocina: ' + restaurante.tipoCocina);
            $('#restaurant-description').text('Descripción: ' + restaurante.descripcion);
        }

        // Manejar el cambio en el select de ciudad
        $('#citySelect').change(function () {
            var selectedCity = $(this).val();
            loadRestaurantList(selectedCity);
        })

        // Obtener el nombre de usuario del token JWT
        var jwtPayload = jwtToken.split('.')[1];
        var decodedJwt = atob(jwtPayload);
        var username = JSON.parse(decodedJwt).unique_name;
        $('#username').text(username);
 

        $('#logoutButton').click(function () {
            // Eliminar el token JWT del almacenamiento local del navegador
            localStorage.removeItem('jwtToken');
            // Redirigir al usuario a la página de inicio de sesión
            window.location.href = 'index.html';
        });