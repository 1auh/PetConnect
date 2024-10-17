let map;
let service; // Declare service globally

function initMap() {
    // Mapa inicializado con una ubicación genérica
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 }, // Ubicación inicial
        zoom: 6
    });

    // Inicializa el servicio de Places
    service = new google.maps.places.PlacesService(map);

    // Llama a getLocation para obtener la ubicación del usuario
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("status").innerHTML = "La geolocalización no es soportada por este navegador.";
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const userLocation = { lat: lat, lng: lon };

    // Centrar el mapa en la ubicación del usuario
    map.setCenter(userLocation);
    map.setZoom(14);

    // Llama a la función para buscar centros de adopción
    searchAdoptionCenters(userLocation);

    // Agregar un marcador en la ubicación del usuario
    new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Tu ubicación"
    });

    // Opcional: Muestra la ubicación en el HTML
    document.getElementById("status").innerHTML = "Latitud: " + lat + "<br>Longitud: " + lon;
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("status").innerHTML = "Has denegado la solicitud de Geolocalización.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("status").innerHTML = "Información de ubicación no disponible.";
            break;
        case error.TIMEOUT:
            document.getElementById("status").innerHTML = "La solicitud de ubicación ha caducado.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("status").innerHTML = "Ocurrió un error desconocido.";
            break;
    }
}

function searchAdoptionCenters(location) {
    const request = {
        location: location,
        radius: '5000', // Radio en metros
        type: ['veterinary_care', 'pet_store', 'zoo', 'pet_adoption'], // Tipos de lugares
        keyword: 'adopción', // Palabras clave adicionales
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                // Crear un marcador para cada lugar encontrado
                const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name,
                });

                // Opcional: Agregar información adicional sobre el lugar
                const infowindow = new google.maps.InfoWindow({
                    content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`,
                });

                marker.addListener('click', () => {
                    infowindow.open(map, marker);
                });
            });
        } else {
            console.error('Error al buscar lugares:', status);
        }
    });
}
