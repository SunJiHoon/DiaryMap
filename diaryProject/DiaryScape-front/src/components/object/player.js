import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class player {
  async loadGltf(name) {
    const gltfLoader = new GLTFLoader().setPath(
      "./assets/models/".concat(name, "/")
    );
    let _character;
    await gltfLoader.loadAsync("scene.gltf").then((characterGltf) => {
      _character = characterGltf.scene;
      _character.name = "player";
      _character.userData = { myNodes: [] };
      _character.scale.set(10, 10, 10);
    });
    return _character;
  }
}

export default player;
