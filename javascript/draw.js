// Crie um grupo de camadas para armazenar as formas desenhadas
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

// Adicione o controle de desenho ao mapa
var drawControl = new L.Control.Draw({
    draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: false  // Habilitar o desenho de pontos como CircleMarker
    },
    edit: {
        featureGroup: editableLayers
    }
});
map.addControl(drawControl);

// Adicione um evento para lidar com a criação de novas formas
map.on(L.Draw.Event.CREATED, function (e) {
    var layer = e.layer;
     // Define estilo para círculos
     if (e.layerType === 'circle') {
        layer.setStyle({
            color: 'green',       // Cor da borda do círculo
            fillColor: 'green',   // Cor de preenchimento verde
            fillOpacity: 0.5      // Define uma opacidade de preenchimento
        });
    }

    // Define estilo para polígonos
    if (e.layerType === 'polygon') {
        layer.setStyle({
            color: 'green',       // Cor da borda do polígono
            fillColor: 'green',   // Cor de preenchimento verde
            fillOpacity: 0.5      // Define uma opacidade de preenchimento
        });
    }

    // Define estilo para polilinhas
    if (e.layerType === 'polyline') {
        layer.setStyle({
            color: 'green'        // Cor da polilinha
        });
    }

    // Define estilo para retângulos
    if (e.layerType === 'rectangle') {
        layer.setStyle({
            color: 'green',       // Cor da borda do retângulo
            fillColor: 'green',   // Cor de preenchimento verde
            fillOpacity: 0.5      // Define uma opacidade de preenchimento
        });
    }

    // Define estilo para CircleMarker
    if (e.layerType === 'circlemarker') {
        layer.setStyle({
            radius: 5,            // Define um tamanho menor para o círculo (5 pixels de raio)
            color: 'red',       // Cor da borda do círculo
            fillColor: 'red',   // Cor de preenchimento verde
            fillOpacity: 0.7      // Define uma opacidade de preenchimento
        });
    }
    editableLayers.addLayer(layer);
});

