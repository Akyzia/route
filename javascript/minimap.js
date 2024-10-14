// Crie uma camada base para o MiniMap (pode ser a mesma que o mapa principal ou uma diferente)
var miniMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

// Adicione o MiniMap ao seu mapa principal
var miniMap = new L.Control.MiniMap(miniMapLayer, {
    toggleDisplay: true,  // Permite ao usuário esconder ou mostrar o MiniMap
    minimized: false      // Iniciar com o MiniMap aberto
}).addTo(map);


