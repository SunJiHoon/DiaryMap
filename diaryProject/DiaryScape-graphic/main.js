import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJExporter} from 'three/examples/jsm/exporters/OBJExporter'
import axios from 'axios'

const loader = new GLTFLoader();
const objLoader = new THREE.ObjectLoader();
const exporter = new OBJExporter();

let scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const testGeometry = new THREE.PlaneGeometry(2,3);
const testMaterial = new THREE.MeshBasicMaterial({color: 'green'});
const testMesh = new THREE.Mesh(testGeometry, testMaterial);
testMesh.name = "plane";

const testCircleG = new THREE.CircleGeometry(1.5);
const testCircleM = new THREE.MeshBasicMaterial();
const testCircle = new THREE.Mesh(testCircleG, testCircleM);

testCircle.position.y += 3;
testCircle.material.color = new THREE.Color('blue');

scene.add(testMesh, testCircle);

const testJson = testMesh.toJSON();
console.log(testJson);
const loadObj = objLoader.parse(testJson);
loadObj.name = "plane_2";

scene.add(loadObj);
loadObj.position.x -= 2.5;

const planes = scene.getObjectsByProperty("name", "plane");
//planes[1].material.color = new THREE.Color('red');

const sceneJson = scene.toJSON();
console.log(sceneJson);

scene.clear();
scene = new THREE.ObjectLoader().parse(sceneJson);

const planeObjects = scene.getObjectsByProperty("name", "plane");
planeObjects[0].position.x += 2.5;
//planeObjects[1].position.x -= 2.5;
//planeObjects[1].material.color = new THREE.Color('purple');

scene.children[1].material.color = new THREE.Color('grey');

camera.position.z += 5;

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

document.addEventListener('keydown', onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 65) {
        axios.post("http://localhost:8080/api/Obj", sceneJson).then((res) => {
			console.log(res.data)
		})
    }
};

animate();