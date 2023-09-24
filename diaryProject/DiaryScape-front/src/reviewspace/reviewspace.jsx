import * as THREE from "three";
import InputManager from "../components/manager/inputManager";
import ObjectManager from "../components/manager/objectManager";
import { useRef, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Box, Button } from '@chakra-ui/react'

const ReviewSpace = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        let renderer, scene, camera
        
        let inputManager
        let objectManager

        async function init() {
            scene = new THREE.Scene();

            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
                alpha: true,
            });
            renderer.setClearColor(0x80ffff, 1);

            camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                1,
                300
            );
            camera.rotation.y = Math.PI / 4;
            camera.position.set(-35, 45, 45);
            camera.lookAt(0,0,0);

            objectManager = new ObjectManager(scene);
            objectManager.newMap("spongebob").then(()=> { inputManager = new InputManager(camera, scene) });

            // document.body.appendChild(renderer.domElement);
            renderer.setSize(window.innerWidth, window.innerHeight);
            // renderer.render(scene, camera);
        }
        
        init()

        window.addEventListener("resize", handleResize);

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

        return (() => {
            cancelAnimationFrame(req)
            window.removeEventListener("resize", handleResize)
            inputManager?.cleanup()
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