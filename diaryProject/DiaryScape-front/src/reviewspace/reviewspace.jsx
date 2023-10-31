import * as THREE from "three";
import InputManager, { selectOption } from "../components/manager/inputManager";
import ObjectManager from "../components/manager/objectManager";
import { useRef, useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { Box, Button } from '@chakra-ui/react'
import { useSelector } from "react-redux";

const ReviewSpace = () => {
    const canvasRef = useRef(null)
    const tripData = useSelector((state) => state.trip)
    const startnodeData = useSelector((state) => state.startnode)
    let objectManager;

    const newMapFunctionRef = useRef(null)
    const addNodeFunctionRef = useRef(null)
    const [nodeMenuOn, setNodeMenuOn] = useState(false)
    const [nodeMenuPosition, setNodeMenuPosition] = useState({x: 0, y: 0,})

    const [selectOptionData, setSelectOptionData] = useState({})

    useEffect(() => {
        let renderer, scene, camera
        
        let inputManager
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

            objectManager = new ObjectManager(scene, camera, tripData, startnodeData);
            newMapFunctionRef.current = objectManager.newMap
            objectManager.checkMapSave().then(()=> {
                inputManager = new InputManager(camera, scene, nodeMenuOn, setNodeMenuOn, setNodeMenuPosition, selectOptionData, setSelectOptionData)
                addNodeFunctionRef.current = selectOption
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
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

    function onResetButtonClick() {
        if(newMapFunctionRef.current) {
            newMapFunctionRef.current("spongebob");
        }
    }
    
    function onAddNodeButtonClick() {
        if(addNodeFunctionRef.current) {
            addNodeFunctionRef.current(selectOptionData);
        }
    }
    
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
            <Box
                display="flex"
                flexDirection="column"
                ml={4}
                mt={4}
            >
            <p>tripData.title : {tripData.title}</p>
            <p>tripData.mapId : {tripData.mapId}</p>
            <p>tripData.startX : {tripData.startX}</p>
            <p>tripData.startY : {tripData.startY}</p>
            </Box>
            <Box>
                <Button onClick={onResetButtonClick}>
                    reset
                </Button>
            </Box>
        </div>
    <div>
        <canvas ref={canvasRef}></canvas>
    </div>
    <div
    style={{
        position: "fixed",
        top: nodeMenuPosition.y,
        left: nodeMenuPosition.x,
        zIndex: 4,
    }}
    >
        <Box
            visibility={nodeMenuOn ? "visible" : "hidden"}
            bgColor="white"
            borderRadius="2px"
            w="200px"
            opacity={nodeMenuOn ? "0.8" : "0"}
            transition="all 0.3s"
        >
            <Box fontWeight="bold">노드 정보</Box>
            {selectOptionData.select_option && <Box>
            {selectOptionData.select_option.userData.title}<br />
            {selectOptionData.select_option.userData.tel}<br />
            위치: {selectOptionData.select_option.userData.address} <br/>

            </Box>
            }
            <Button
                onClick={onAddNodeButtonClick}
                colorScheme="teal"
                mb={2}
            >
                노드 추가
            </Button>
        </Box>
    </div>
    </>)
}

export default ReviewSpace