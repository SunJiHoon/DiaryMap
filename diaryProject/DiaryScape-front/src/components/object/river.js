import * as THREE from 'three'

class river{
    constructor(startPos, endPos, width){
        const riverHeight = startPos.distanceTo(endPos);
        const riverGeometry = new THREE.PlaneGeometry(riverHeight, width);
    }
}