import * as THREE from "three";
import Map from "../components/object/map";
import Player from "../components/object/player";
import InputManager from "../components/manager/inputManager";
import SaveManager from "../components/manager/saveManager";
import { useRef, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Box, Button } from '@chakra-ui/react'
const ReviewSpace = () => {
    const canvasRef = useRef(null)

    useEffect(() => {

        async function init() {
            const scene = new THREE.Scene();

            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
                alpha: true,
            });
            renderer.setClearColor(0x80ffff, 1);

            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                1,
                300
            );
            camera.position.z = 100;
            camera.rotation.y = Math.PI / 4;

            const saveManager = new SaveManager(scene);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
            directionalLight.position.set(-10, 10, 20);
            scene.add(directionalLight);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);

            const map = new Map();
            scene.add(map.mesh);

            const player = new Player();
            const playerMesh = await player.loadGltf("spongebob");

            saveManager.saveObj(playerMesh);
            scene.add(playerMesh);

            camera.position.set(-35, 40, 45);
            camera.lookAt(0, 0, 0);

            const inputManager = new InputManager(camera, scene);

            // document.body.appendChild(renderer.domElement);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.render(scene, camera);

            const tempGeoMetry = new THREE.BoxGeometry(1, 1, 1);
            const tempMaterial = new THREE.MeshBasicMaterial();
            const tempMesh = new THREE.Mesh(tempGeoMetry, tempMaterial);
            saveManager.saveObj(tempMesh);

            const loadTemp = window.addEventListener("resize", handleResize);

            function handleResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.render(scene, camera);
            }

            let req
            function anim() {
                renderer.render(scene, camera);

                req = requestAnimationFrame(anim);
            }
            anim();
        }
        
        init()

        return (() => {
            // cancelAnimationFrame(req)
            // window.removeEventListener("resize", handleResize)
        })
    }, [])

    return (<>
        <div style={{
            position:"fixed",
            top:"0",
            left:"0",
            zIndex:"2"
        }}>
            <Box
                ml={4}
                mt={4}
            >
                <Link to="/">
                    <Button colorScheme="teal">홈으로 돌아가기</Button>
                </Link>
            </Box>
            {/* <Box
                mt={4}
            >
                { username &&
                    <Box>{username} 님, 안녕하세요!</Box>
                }
            </Box> */}
        </div>
    <div>
        <canvas ref={canvasRef}></canvas>
    </div>
    </>)
}

export default ReviewSpace