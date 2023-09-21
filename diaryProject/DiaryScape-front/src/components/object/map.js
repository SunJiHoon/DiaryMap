import * as THREE from "three";

class Map {
  constructor() {
    const mapGeometry = new THREE.PlaneGeometry(1000, 1000, 500, 500);
    const mapMaterial = new THREE.MeshStandardMaterial({
      color: "green",
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const mapMesh = new THREE.Mesh(mapGeometry, mapMaterial);
    mapMesh.rotation.x = Math.PI / 2;

    this.mesh = mapMesh;
    mapMesh.name = "ground";
  }
}

export default Map;
