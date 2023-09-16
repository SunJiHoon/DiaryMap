import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";

let scene;
let exporter;

class saveManager {
  constructor(_scene) {
    scene = _scene;
    exporter = new OBJExporter();
  }

  saveObj(object) {
    const data = exporter.parse(object);
    console.log(data);
  }
}

/*function saveAllObj(objects) {
  const data = exporter.parser(objects[i]);
}*/

export default saveManager;
