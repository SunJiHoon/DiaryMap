import * as THREE from "three";
import axios from "axios";

let scene;
const loader = new THREE.ObjectLoader();

class saveManager {
  constructor(_scene) {
    scene = _scene;
  }

  saveObj(object) {
    console.log(object.toJSON());
    console.log(object.position);
    console.log(object.rotation);
  }

  saveObjs() {
    console.log(scene.toJSON());
    axios.post("http://localhost:8080/api/Obj").then((res) => {
      console.log(res.data);
    });
  }

  loadObj(name) {
    axios.get("http://localhost:8080/api/Obj").then((res) => {
      console.log(res.data);
      loader.parse(res.data);
    });
  }

  loadObjs() {
    //load scene
    axios.get("http://localhost:8080/api/Obj").then((res) => {
      if (res.data == "null") {
        //초기 작업(맵 생성, 캐릭터 생성);
      } else {
        scene = loader.parse(res.data);
        axios.get("http://localhost:8080/api/Objs").then((res) => {
          res.data.foreach((object) => {
            const obj = scene.getObjectByName(object.name);
            obj.position.set(object.pos);
            obj.rotation.set(object.rot);
          });
        });
      }
    });
  }
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 65) {
    axios.post("http://localhost:8080/api/Obj", sceneJson).then((res) => {
      console.log(res.data);
    });
  } else if (keyCode == 66) {
    axios.get("http://localhost:8080/api/Obj").then((res) => {
      console.log(res.data);
    });
  }
}

export default saveManager;
