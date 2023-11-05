import * as THREE from "three";
import InputManager, { selectOption } from "../components/manager/inputManager";
import ObjectManager from "../components/manager/objectManager";
import SaveManager from "../components/manager/saveManager";
import DayManager from "../components/manager/dayManager";
import { useRef, useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { Box, Button, IconButton, Checkbox, Select } from '@chakra-ui/react'
import { useSelector } from "react-redux";
import { IoChevronDown, IoRemove } from "react-icons/io5"
import { useNavigate } from "react-router-dom";
// import Map from "../components/object/map";
import { createContext, useContext } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";

export const CanvasContext = createContext()

const ReviewSpace = () => {
    const [canvasState, setCanvasState] = useState(null)

    const navigate = useNavigate()
    const canvasRef = useRef(null)
    const tripData = useSelector((state) => state.trip)
    const startnodeData = useSelector((state) => state.startnode)

    const newMapFunctionRef = useRef(null)
    const addNodeFunctionRef = useRef(null)
    // const setStateDataRef = useRef(null)
    // const printStateDataRef = useRef(null)
    const [nodeMenuOn, setNodeMenuOn] = useState(false)
    const [nodeMenuPosition, setNodeMenuPosition] = useState({ x: 0, y: 0, })

    const [selectOptionData, setSelectOptionData] = useState({})

    const [debugMenuOpen, setDebugMenuOpen] = useState(false)

    const [dayModuleList, setDayModuleList] = useState([{ id: 1, data: "day1 data" }])
    
    const [dayMenuOpenList, setDayMenuOpenList] = useState([false])
    const [dayCheckedList, setDayCheckedList] = useState([true])
    const [nextDayMenuId, setNextDayMenuId] = useState(2)
    const [currentDay, setCurrentDay] = useState(1)

    mapboxgl.accessToken = 'pk.eyJ1IjoiMHJ5dW5nIiwiYSI6ImNsb2k5NXg2NjFjYW4ybHJ3MHQ0c3U2c3QifQ.Xq5bPxVFzNOa3wjmYJVU4A';
    const map = useRef(null)
    const mapContainer = useRef(null)

    let objectManager, saveManager, inputManager, dayManager = new DayManager();

    dayManager.setStateSetter(setDayModuleList)

    dayManager.updateFromFrontData(dayModuleList, dayCheckedList, currentDay, nextDayMenuId)


    useEffect(() => {
        dayManager.updateFromFrontData(dayModuleList, dayCheckedList, currentDay, nextDayMenuId)
        dayManager.printStateData()
    }, [dayModuleList, dayCheckedList, currentDay, nextDayMenuId])

    useEffect(() => {
        // dayManager.dataPropagationTest()
        if (map.current) return;
        map.current = new mapboxgl.Map({
            style: 'mapbox://styles/mapbox/light-v11',
            center: [tripData.startX, tripData.startY],
            zoom: 19.5,
            pitch: 45,
            bearing: -17.6,
            container: mapContainer.current,
            antialias: true
        });
        // map.current.dragRotate.disable()
        // map.current.touchZoomRotate.disableRotation()
        map.current.addControl(new MapboxLanguage({
            defaultLanguage: 'ko'
        }));


        // let mglCameraPosition = new mapboxgl.MercatorCoordinate(0, 0, 0)

        // let req

        // function handleResize() {
        //     camera.aspect = window.innerWidth / window.innerHeight;
        //     camera.updateProjectionMatrix();

        //     renderer.setSize(window.innerWidth, window.innerHeight);
        //     renderer.render(scene, camera);
        // }

        const setMglCameraPosition = (x, y, z) => {
            const mglcamera = map.current.getFreeCameraOptions()
            mglcamera.position.x = x
            mglcamera.position.y = y
            mglcamera.position.z = z
            map.current.setFreeCameraOptions(mglcamera)
        }

        // const anim = () => {
        //     renderer.render(scene, camera);

        //     req = requestAnimationFrame(anim);
        // }

        const modelOrigin = [tripData.startX, tripData.startY];
        const modelAltitude = 0;
        const modelRotate = [Math.PI / 2, 0, 0];

        const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
            modelOrigin,
            modelAltitude
        );

        const modelTransform = {
            translateX: modelAsMercatorCoordinate.x,
            translateY: modelAsMercatorCoordinate.y,
            translateZ: modelAsMercatorCoordinate.z,
            rotateX: modelRotate[0],
            rotateY: modelRotate[1],
            rotateZ: modelRotate[2],
            scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
        };

        let mapCustomLayer

        const customLayer = {
            id: '3d-model',
            type: 'custom',
            renderingMode: '3d',
            onAdd: function (map, gl) {
                // async function init() {
                this.scene = new THREE.Scene();

                this.renderer = new THREE.WebGLRenderer({
                    canvas: map.getCanvas(),
                    context: gl,
                    antialias: true,
                    // alpha: true,
                });
                // this.renderer.setClearColor(0x80ffff, 1);

                this.camera = new THREE.Camera()
                // camera.rotation.y = Math.PI / 4;
                // camera.position.set(-35, 45, 45);
                // camera.lookAt(0, 0, 0);

                objectManager = new ObjectManager(this.scene, this.camera, tripData, startnodeData);
                objectManager.newMap("spongebob");
                newMapFunctionRef.current = objectManager.newMap;
                saveManager = new SaveManager(tripData);
                saveManager.checkIsFirst().then(() => {
                    inputManager = new InputManager(this.camera, map, setMglCameraPosition, this.scene, nodeMenuOn, setNodeMenuOn, setNodeMenuPosition, selectOptionData, setSelectOptionData)
                    addNodeFunctionRef.current = selectOption
                });
                this.renderer.setSize(window.innerWidth, window.innerHeight);

                // let _cameraPosition = map.getFreeCameraOptions().position;
                // cameraPosition.set(_cameraPosition.x, _cameraPosition.y, _cameraPosition.z)
                // if (inputManager) inputManager.setCameraPosition(cameraPosition)
                // }
                // init()
                this.renderer.autoClear = false
                this.map = map
            },
            render: function (gl, matrix) {
                const rotationX = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(1, 0, 0),
                    modelTransform.rotateX
                );
                const rotationY = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 1, 0),
                    modelTransform.rotateY
                );
                const rotationZ = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 0, 1),
                    modelTransform.rotateZ
                );

                const m = new THREE.Matrix4().fromArray(matrix);
                const l = new THREE.Matrix4()
                    .makeTranslation(
                        modelTransform.translateX,
                        modelTransform.translateY,
                        modelTransform.translateZ
                    )
                    .scale(
                        new THREE.Vector3(
                            modelTransform.scale,
                            -modelTransform.scale,
                            modelTransform.scale
                        )
                    )
                    .multiply(rotationX)
                    .multiply(rotationY)
                    .multiply(rotationZ);

                this.camera.projectionMatrix = m.multiply(l);
                this.renderer.resetState();
                this.renderer.render(this.scene, this.camera);

                // let _cameraPosition = map.current.getFreeCameraOptions().position;
                // MglCameraPosition.set(_cameraPosition.x, _cameraPosition.y, _cameraPosition.z)
                const freeCamera = this.map.getFreeCameraOptions();
                let newMglCameraPosition = new THREE.Vector4(freeCamera.position.x, freeCamera.position.y, freeCamera.position.z, 1);
                if (inputManager) inputManager.setMglCameraPosition(new mapboxgl.MercatorCoordinate(newMglCameraPosition.x, newMglCameraPosition.y, newMglCameraPosition.z))
                // console.log(camera.position)
                // console.log(newMglCameraPosition)
                newMglCameraPosition.applyMatrix4(l.invert());
                if (inputManager) inputManager.setMglCameraPositionTransformed(new mapboxgl.MercatorCoordinate(newMglCameraPosition.x, newMglCameraPosition.y, newMglCameraPosition.z))
                this.map.triggerRepaint()
                // window.addEventListener("resize", handleResize);

                // anim();
            },
        }

        map.current.on('style.load', () => {
            // Insert the layer beneath any symbol layer.
            const layers = map.current.getStyle().layers;
            const labelLayerId = layers.find(
                (layer) => layer.type === 'symbol' && layer.layout['text-field']
            ).id;

            // The 'building' layer in the Mapbox Streets
            // vector tileset contains building height data
            // from OpenStreetMap.
            map.current.addLayer(
                {
                    'id': 'add-3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'paint': {
                        'fill-extrusion-color': '#aaa',

                        // Use an 'interpolate' expression to
                        // add a smooth transition effect to
                        // the buildings as the user zooms in.
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                },
                labelLayerId
            );
        })
        map.current.on('load', () => {
            map.current.addLayer(customLayer)
        })

        // dayManager = new DayManager()
        // setStateDataRef.current = dayManager.setStateData



        return (() => {
            // cancelAnimationFrame(req)
            // window.removeEventListener("resize", handleResize)
            inputManager?.cleanup()
            map.current.remove()
        })
    }, [])

    // if (setStateDataRef.current) {
    //     setStateDataRef.current(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId)
    // }

    function onResetButtonClick() {
        if (newMapFunctionRef.current) {
            newMapFunctionRef.current("spongebob");
        }
    }

    function onAddNodeButtonClick() {
        if (addNodeFunctionRef.current) {
            addNodeFunctionRef.current(selectOptionData);
        }
    }

    return (<>
        <CanvasContext.Provider value={[canvasState, setCanvasState]}>
            {/* <Map /> */}
            <div style={{
                position: "fixed",
                top: "0",
                left: "0",
                zIndex: "2",
            }}>
                <Box
                    mt={4}
                    p={4}
                    w="240px"
                    bgColor="#ffffff"
                    borderWidth={1}
                    borderRadius={4}
                    borderColor="gray.300"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    marginLeft="1.6em"
                    boxShadow="2xl"
                >
                    <Box>
                        <Button colorScheme="gray" onClick={() => navigate("/")}>홈 화면으로</Button>
                    </Box>
                    <Box mt={4}>
                        <Button onClick={onResetButtonClick} colorScheme="blue">
                            reset
                        </Button>
                    </Box>

                    <Box
                        borderTop="1px"
                        borderBottom="1px"
                        borderColor="gray.300"
                        // boxShadow="md"
                        mt={6}
                        p={2}
                        w="100%"
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Box fontWeight="semibold">디버그 출력</Box>
                            <IconButton
                                variant="ghost"
                                colorScheme="blackAlpha"
                                size="sm"
                                icon={debugMenuOpen ? <IoRemove /> : <IoChevronDown />}
                                onClick={() => setDebugMenuOpen(!debugMenuOpen)}
                            />
                        </Box>
                        <Box
                            textAlign="left"
                            visibility={debugMenuOpen ? "visible" : "hidden"}
                            opacity={debugMenuOpen ? "1" : "0"}
                            maxH={debugMenuOpen ? "100vh" : "0vh"}
                            mt={debugMenuOpen ? 2 : 0}
                            overflowX="auto"
                            transition="all 0.6s ease-in-out"
                        >
                            <p>tripData.title : {tripData.title}</p>
                            <p>tripData.date : {tripData.date}</p>
                            <p>tripData.mapId : {tripData.mapId}</p>
                            <p>tripData.startX : {tripData.startX}</p>
                            <p>tripData.startY : {tripData.startY}</p>
                        </Box>
                    </Box>
                </Box>
            </div>
            <div style={{
                position: "fixed",
                top: "0",
                right: "0",
                zIndex: "2",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                marginRight: "1.6em",
            }}>
                <Box
                    mt={4}
                    p={4}
                    mr={4}
                    w="240px"
                    minH="30px"
                    bgColor="#ffffff"
                    border={1}
                    borderRadius={4}
                    borderColor="gray"
                    textAlign="left"
                    boxShadow="2xl"
                >
                    <Select value={currentDay} onChange={(e) => {
                        setCurrentDay(e.target.value)
                        // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId)
                        // dayManager.printStateData()
                    }}>
                        {dayModuleList.map((dayModule) => (
                            <option key={"option" + dayModule.id} value={dayModule.id} > Day {dayModule.id}</option>
                        ))}
                    </Select>
                </Box>
                <Box
                    mt={4}
                    p={4}
                    w="240px"
                    minH="300px"
                    bgColor="#ffffff"
                    border={1}
                    borderRadius={4}
                    borderColor="gray"
                    textAlign="left"
                    boxShadow="2xl"
                >
                    {dayModuleList.map((dayModule) => (
                        <Box key={dayModule.id} mb={6} pt={2} pb={2} borderTop="1px" borderBottom="1px" borderColor="gray.300">
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                mb={2}
                            >
                                <Box fontSize="2xl">Day {dayModule.id}</Box>
                                <Checkbox defaultChecked isChecked={dayCheckedList[dayModule.id - 1]} onChange={(e) => {
                                    const nextDayCheckedList = dayCheckedList.map((dayChecked, i) => {
                                        if (i + 1 == dayModule.id) {
                                            return !dayChecked
                                        } else {
                                            return dayChecked
                                        }
                                    })
                                    setDayCheckedList(nextDayCheckedList)
                                    // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId)
                                    // dayManager.printStateData()
                                }}></Checkbox>
                            </Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Box fontWeight="semibold">Day 정보</Box>
                                <IconButton
                                    variant="ghost"
                                    colorScheme="blackAlpha"
                                    size="sm"
                                    icon={dayMenuOpenList[dayModule.id - 1] ? <IoRemove /> : <IoChevronDown />}
                                    onClick={(e) => {
                                        const nextDayMenuOpenList = dayMenuOpenList.map((menuOpen, i) => {
                                            if (i + 1 == dayModule.id) {
                                                return !menuOpen
                                            }
                                            else {
                                                return menuOpen
                                            }
                                        })
                                        setDayMenuOpenList(nextDayMenuOpenList)
                                        // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId)
                                        // dayManager.printStateData()
                                    }}
                                />
                            </Box>
                            <Box
                                textAlign="left"
                                visibility={dayMenuOpenList[dayModule.id - 1] ? "visible" : "hidden"}
                                opacity={dayMenuOpenList[dayModule.id - 1] ? "1" : "0"}
                                maxH={dayMenuOpenList[dayModule.id - 1] ? "100vh" : "0vh"}
                                mt={dayMenuOpenList[dayModule.id - 1] ? 1 : 0}
                                overflowX="auto"
                                transition="all 0.3s ease-in-out"
                            >
                                {dayModule.data}
                            </Box>
                        </Box>
                    ))}
                    <Button
                        colorScheme="blue"
                        onClick={async (e) => {
                            setDayModuleList(
                                [
                                    ...dayModuleList,
                                    { id: nextDayMenuId, data: "day information", }
                                ]
                            )
                            setDayMenuOpenList(
                                [
                                    ...dayMenuOpenList,
                                    false
                                ]
                            )
                            setDayCheckedList(
                                [
                                    ...dayCheckedList,
                                    true
                                ]
                            )
                            setCurrentDay(nextDayMenuId)
                            setNextDayMenuId(nextDayMenuId + 1)
                            dayManager.plusDay()
                        }}>
                        Day 추가
                    </Button>
                </Box>
            </div >
            <div ref={mapContainer} style={{ height: "100vh" }} />
            <div
                style={{
                    position: "fixed",
                    top: nodeMenuPosition.y,
                    left: nodeMenuPosition.x,
                    zIndex: nodeMenuOn ? 4 : -2,
                    transition: "z-index .1s linear .4s"
                }}
            >
                <Box
                    visibility={nodeMenuOn ? "visible" : "hidden"}
                    bgColor="white"
                    borderRadius="2px"
                    w="200px"
                    opacity={nodeMenuOn ? "1" : "0"}
                    boxShadow="2xl"
                    textAlign="left"
                    p={4}
                    transition="all .3s ease-in-out .05s"
                >
                    <Box fontWeight="bold">노드 정보</Box>
                    {selectOptionData.select_option && <Box>
                        {selectOptionData.select_option.userData.title}<br />
                        {selectOptionData.select_option.userData.tel}<br />
                        위치: {selectOptionData.select_option.userData.address} <br />

                    </Box>
                    }
                    <Button
                        onClick={onAddNodeButtonClick}
                        colorScheme="teal"
                        mt={2}
                    >
                        노드 추가
                    </Button>
                </Box>
            </div>
        </CanvasContext.Provider>
    </>)
}

export default ReviewSpace