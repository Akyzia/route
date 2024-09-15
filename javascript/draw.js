// Crie um grupo de camadas para armazenar as formas desenhadas
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

// Adicione o controle de desenho ao mapa
var drawControl = new L.Control.Draw({
    draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true
    },
    edit: {
        featureGroup: editableLayers
    }
});
map.addControl(drawControl);

// Adicione um evento para lidar com a criação de novas formas
map.on(L.Draw.Event.CREATED, function (e) {
    var layer = e.layer;
    editableLayers.addLayer(layer);
});