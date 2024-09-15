// Inicializar o mapa
var map = L.map('map', {
  center: [-27.2723, -50.2515],
  zoom: 7
});

// Adicionar múltiplos mapas base
var baseMaps = {
  "Street Map (ArcGIS)": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Autoria: Bruna Borges da Rocha'
  }),
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Autoria: Bruna Borges da Rocha'
  }),
  "Esri_WorldImagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Autoria: Bruna Borges da Rocha'
  }),
};

// Adicionar uma camada base padrão
baseMaps["OpenStreetMap"].addTo(map);

// Controle de layers
L.control.layers(baseMaps).addTo(map);


// Variável para armazenar a camada de shapefile importado
let shapefileLayerGroup;

// Layer control para habilitar/desabilitar camadas
const overlayMaps = {};
const layerControl = L.control.layers(null, overlayMaps).addTo(map);

// Função para converter shapefile para GeoJSON
function handleShapefileUpload(file) {
  const reader = new FileReader();

  reader.onload = function(event) {
    const arrayBuffer = event.target.result;

    // Usar JSZip para descompactar o shapefile
    JSZip.loadAsync(arrayBuffer).then(function(zip) {
      const shpFile = zip.file(/.shp$/i)[0];
      const dbfFile = zip.file(/.dbf$/i)[0];

      if (shpFile && dbfFile) {
        Promise.all([shpFile.async("arraybuffer"), dbfFile.async("arraybuffer")])
          .then(function([shpBuffer, dbfBuffer]) {
            // Usar a biblioteca shapefile-js para converter shapefile em GeoJSON
            shapefile.open(shpBuffer, dbfBuffer)
              .then(source => {
                // Criar um grupo de camada para o shapefile
                shapefileLayerGroup = L.featureGroup().addTo(map);

                const readNext = () => source.read().then(function(result) {
                  if (result.done) {
                    console.log('Shapefile completamente carregado.');

                    // Adicionar o grupo de camada ao controle de layers
                    overlayMaps['Shapefile Importado'] = shapefileLayerGroup;
                    layerControl.addOverlay(shapefileLayerGroup, 'Shapefile Importado');

                    return;
                  }

                  const geojsonFeature = result.value;

                  // Adicionar o GeoJSON ao grupo de camada
                  shapefileLayerGroup.addLayer(L.geoJSON(geojsonFeature));

                  return readNext();
                });
                readNext();
              })
              .catch(function(error) {
                console.error("Erro ao ler o shapefile:", error);
              });
          });
      } else {
        console.error("Shapefile e/ou DBF faltando no arquivo zip.");
      }
    }).catch(function(error) {
      console.error("Erro ao descompactar o arquivo zip:", error);
    });
  };

  reader.readAsArrayBuffer(file);
}

// Listener para o botão de importação
document.getElementById('importerBtn').addEventListener('click', function() {
  document.getElementById('fileInput').click();
});

// Listener de upload de arquivos
document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    handleShapefileUpload(file);
  }
});