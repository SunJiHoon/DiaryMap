/*import * as THREE from 'three';

class Map {
  constructor() {
    return this.loadMap();
  }

  async loadMap(){
    const mapGeometry = new THREE.PlaneGeometry(1000, 1000, 500, 500);
    const mapMaterial = new THREE.MeshBasicMaterial({
      color: "green",
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const mapMesh = new THREE.Mesh(mapGeometry, mapMaterial);
    mapMesh.rotation.x = -Math.PI / 2;

    mapMesh.name = "ground";
    return mapMesh;
  }
}

export default Map;
*/
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

class map {
  constructor() {
    this.initMap();
  }
  initMap(){
    //mapboxgl.accessToken = 'pk.eyJ1IjoiMHJ5dW5nIiwiYSI6ImNsb2k5NXg2NjFjYW4ybHJ3MHQ0c3U2c3QifQ.Xq5bPxVFzNOa3wjmYJVU4A';
    var map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.0066, 40.7135],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'root',
      antialias: true
    });
  }
    /*
    map.on('style.load', () => {
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      map.addLayer(
        {
          'id': 'add-3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    });
  }*/
}

export default map;