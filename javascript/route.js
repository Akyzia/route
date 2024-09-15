

let waypoints = [];
let markers = []; // Array para armazenar os marcadores
let routes = [];  // Array para armazenar as rotas
const apiKey = "5b3ce3597851110001cf6248b672d7dfdd9044b6870295558109340b";

// Função para adicionar paradas e calcular rota
function addStop(latlng) {
  // Adicionar marcador no mapa
  const marker = L.marker(latlng).addTo(map);
  markers.push(marker); // Armazenar o marcador

  waypoints.push([latlng.lat, latlng.lng]);

  // Calcular a rota a partir do ponto mais próximo
  if (waypoints.length >= 2) {
    const nearestPoint = findNearestPoint(latlng, waypoints.slice(0, -1));
    getRoute(nearestPoint, latlng);
  }
}

// Função para encontrar o ponto mais próximo
function findNearestPoint(newPoint, existingPoints) {
  let nearestPoint = null;
  let nearestDistance = Infinity;

  existingPoints.forEach(point => {
    const distance = calculateDistance(newPoint, L.latLng(point[0], point[1]));
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestPoint = L.latLng(point[0], point[1]);
    }
  });

  return nearestPoint;
}

// Função para calcular a distância entre dois pontos (usando a fórmula Haversine)
function calculateDistance(point1, point2) {
  const R = 6371e3; // Raio da Terra em metros
  const lat1 = point1.lat * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
  const deltaLon = (point2.lng - point1.lng) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em metros
}

// Função para obter a rota da API do OpenRouteService
function getRoute(start, end) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const routeCoords = data.features[0].geometry.coordinates.map(coord => coord.reverse()); // Inverter de [lng, lat] para [lat, lng]

      // Adicionar a nova rota no mapa
      const route = L.polyline(routeCoords, {
        color: 'blue',
        weight: 5,
        opacity: 0.7,
        lineJoin: 'round'
      }).addTo(map);
      routes.push(route); // Armazenar a rota
    })
    .catch(err => console.error(err));
}

// Função para deletar todos os marcadores
function deleteMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = []; // Limpar o array de marcadores
  waypoints = []; // Limpar as paradas
}

// Função para deletar todas as rotas
function deleteRoutes() {
  routes.forEach(route => map.removeLayer(route));
  routes = []; // Limpar o array de rotas
}

let markersEnabled = true;  // Controla se os marcadores podem ser adicionados

// Função para adicionar paradas e calcular rota
function addStop(latlng) {
  if (markersEnabled) { // Só adicionar o marcador se os marcadores estiverem habilitados
    // Adicionar marcador no mapa
    const marker = L.marker(latlng).addTo(map);
    markers.push(marker); // Armazenar o marcador

    waypoints.push([latlng.lat, latlng.lng]);

    // Calcular a rota a partir do ponto mais próximo se houver ao menos 2 pontos
    if (waypoints.length >= 2) {
      const nearestPoint = findNearestPoint(latlng, waypoints.slice(0, -1));
      getRoute(nearestPoint, latlng);
    }
  }
}

// Listener para adicionar ponto ao clicar no mapa
map.on('click', function(e) {
  addStop(e.latlng);
});

// Função para alternar a habilitação/desabilitação de marcadores
function toggleMarkers() {
  markersEnabled = !markersEnabled; // Alterna entre habilitar e desabilitar marcadores

  if (!markersEnabled) {
    document.getElementById("toggleMarkersBtn").innerHTML = "Habilitar Marcadores";
  } else {
    document.getElementById("toggleMarkersBtn").innerHTML = "Desabilitar Marcadores";
  }
}

// Função para deletar todos os marcadores
function deleteMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = []; // Limpar o array de marcadores
  waypoints = []; // Limpar as paradas
}

// Função para deletar todas as rotas
function deleteRoutes() {
  routes.forEach(route => map.removeLayer(route));
  routes = []; // Limpar o array de rotas
}

// Funções de controle de UI para habilitar/desabilitar
document.getElementById('toggleMarkersBtn').addEventListener('click', toggleMarkers);



// Listener para adicionar ponto ao clicar no mapa
map.on('click', function (e) {
  addStop(e.latlng);
});