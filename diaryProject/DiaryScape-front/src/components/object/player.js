import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three';

let walkAnim;

class player {
  async loadGltf(name) {
    const gltfLoader = new GLTFLoader().setPath(
      "./assets/models/"
    )
    let _character;
    await gltfLoader.loadAsync("PuAng.glb").then((characterGltf) => {
      _character = characterGltf.scene.children[0];
      _character.name = "player";
      _character.scale.set(0.1, 0.1, 0.1);
      console.log(_character);
      //this.setAnim(characterGltf);
    });

    return _character;
  }

  setAnim(gltf) {
    console.log(gltf.scene);
    const mixer = new THREE.AnimationMixer(gltf.scene);
    //walkAnim = mixer.clipAction(gltf.animations[0]);
    //walkAnim.repetitions = 5;
    //walkAnim.clampWhenFinished = true;
  }

  playWalkAnim(){
    walkAnim.play();
  }
}

export default player;
