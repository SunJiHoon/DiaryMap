import * as THREE from "three";
import InputManager, { selectOption } from "../components/manager/inputManager";
import ObjectManager from "../components/manager/objectManager";
import SaveManager from "../components/manager/saveManager";
import DayManager from "../components/manager/dayManager";
import { useRef, useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import {
    Box,
    Button,
    IconButton,
    Checkbox,
    Select,
    Textarea,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react'
import { useSelector } from "react-redux";
import { IoChevronDown, IoRemove } from "react-icons/io5"
import { useNavigate } from "react-router-dom";
import { createContext, useContext } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import client from "../utility/client";
import axios from "axios";

export const CanvasContext = createContext()

let nextReviewId = 2

const ReviewSpace = () => {
    const [canvasState, setCanvasState] = useState(null)

    const navigate = useNavigate()
    const canvasRef = useRef(null)
    const tripData = useSelector((state) => state.trip)
    const startnodeData = useSelector((state) => state.startnode)

    const newMapFunctionRef = useRef(null)
    const addNodeFunctionRef = useRef(null)
    const plusSearchNodeRef = useRef(null)
    const loadSearchOptionsRef = useRef(null)
    const updateReviewsRef = useRef(null)

    // const setStateDataRef = useRef(null)
    // const printStateDataRef = useRef(null)
    const [nodeMenuOn, setNodeMenuOn] = useState(false)
    const [nodeMenuPosition, setNodeMenuPosition] = useState({ x: 0, y: 0, })

    const [selectOptionData, setSelectOptionData] = useState({})

    const [debugMenuOpen, setDebugMenuOpen] = useState(false)

    const [dayModuleList, setDayModuleList] = useState([{ id: 1, data: ["day information"] }])
    const [reviews, setReviews] = useState(["review"])
    
    const [dayMenuOpenList, setDayMenuOpenList] = useState([false])
    const [dayCheckedList, setDayCheckedList] = useState([true])
    const [nextDayMenuId, setNextDayMenuId] = useState(2)
    const [currentDay, setCurrentDay] = useState(1)
    const [onPlusDay, setOnPlusDay] = useState(1)

    const [searchValue, setSearchValue] = useState('')
    const [searchResultData, setSearchResultData] = useState([])
    const [nodeSearchSelected, setNodeSearchSelected] = useState(false)
    const [selectedData, setSelectedData] = useState({})
    const [searchResultDataLoading, setSearchResultDataLoading] = useState(false)
    const { isOpen: isNodeSearchOpen, onOpen: onNodeSearchOpen, onClose: onNodeSearchClose } = useDisclosure()
    const { isOpen: isNodeInfoOpen, onOpen: onNodeInfoOpen, onClose: onNodeInfoClose } = useDisclosure()

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
    const map = useRef(null)
    const mapContainer = useRef(null)

    let objectManager, saveManager, inputManager, dayManager = new DayManager();
    updateReviewsRef.current = dayManager.updateReviews

    dayManager.setStateSetter(setDayModuleList)

    dayManager.updateFromFrontData(dayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
    // console.log(tripData);


    useEffect(() => {
        dayManager.updateFromFrontData(dayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
        dayManager.printStateData()
    }, [dayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData])

    useEffect(() => {
        dayManager.plusDay()
    }, [onPlusDay])

    useEffect(() => {
        dayCheckedList.map((dayChecked, i) => {
            if(dayChecked) dayManager.visibleDay(i)
            else dayManager.invisibleDay(i)
        })
    }, [dayCheckedList])

    useEffect(() => {
        updateReviews(reviews)
    }, [reviews])
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
                loadSearchOptionsRef.current = objectManager.loadSearchOptions
                saveManager = new SaveManager(tripData);
                saveManager.checkIsFirst().then(() => {
                    inputManager = new InputManager(this.camera, map, setMglCameraPosition, this.scene, nodeMenuOn, setNodeMenuOn, setNodeMenuPosition, selectOptionData, setSelectOptionData)
                    addNodeFunctionRef.current = selectOption
                    plusSearchNodeRef.current = inputManager.plusSearchNode
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

    const onResetButtonClick = () => {
        if (newMapFunctionRef.current) {
            newMapFunctionRef.current("spongebob");
        }
    }

    const onAddNodeButtonClick = () => {
        if (addNodeFunctionRef.current) {
            addNodeFunctionRef.current(selectOptionData);
        }
    }

    const onPlusSearchNodeClick = (selectedNode) => {
        if (plusSearchNodeRef.current) {
            plusSearchNodeRef.current(selectedNode);
        }
    }

    const loadSearchOptions = (nodeInfoList) => {
        if (loadSearchOptionsRef.current) {
            loadSearchOptionsRef.current(nodeInfoList)
        }
    }

    const updateReviews = (reviews) => {
        if (updateReviewsRef.current) {
            updateReviewsRef.current(reviews)
        }
    }
    
    const onNodeSearchSelect = (nodeData) => {
        setNodeSearchSelected(true)
        setSelectedData(nodeData)
        // console.log("노드 검색 : 노드 선택됨")
        // console.log(nodeData)
    }

    let source
    const onNodeSearch = ((e) => {


        
        // setSearchValue(e.target.value)
        setNodeSearchSelected(false)
        // console.log(e.target.value)

        const searchValueReplaced = searchValue.replace(/ /g, "%20")
        // console.log("search: " + searchValueReplaced)

        // console.log("axios get 요청 : " + "http://localhost:8080/api/openApi/start/list?userKeyword=" + searchValueReplaced)

        setSearchResultDataLoading(true)

        if(!dayManager) return

        if (source) {
            source.cancel()
        }

        source = axios.CancelToken.source()

        client.get("api/kakaoOpenApi/keywordAndCoord/list?mapId=" + tripData.mapId
        + "&userKeyword=" + searchValue
        + "&mapX="+ dayManager.getCurNode().userData.mapX
        + "&mapY=" + dayManager.getCurNode().userData.mapY,
         { cancelToken: source.token })
            .then((res) => {
                setSearchResultDataLoading(false)
                setSearchResultData(res.data)
                // console.log(res.data)
                
                loadSearchOptions(res.data)
            })
    })

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
                        maxW="100%"
                        mt={4}
                    >
                        <Input
                            type="text"
                            placeholder="노드 이름"
                            value={searchValue}
                            onChange={(e) => { setSearchValue(e.target.value) }}
                            mr={2}
                        />
                        <Button onClick={onNodeSearch} colorScheme="blue">
                            노드 검색
                        </Button>
                        <Button onClick={() => {
                            // console.log("선택된 노드")
                            // console.log(selectedData)
                            if(nodeSearchSelected) onPlusSearchNodeClick(selectedData)
                        }}>
                            노드 추가
                        </Button>
                        <Box display="flex" justifyContent="center" mb={2}>
                                <Box w="100%" maxW="500px" display="flex" flexDirection="column">
                                    <Box fontSize="1.4em" mb={2}>노드 선택</Box>
                                    {/* {nodeSearchSelected && <Box>{selectedData.contentid}</Box>} */}
                                    {searchValue.length == 0 && <Box>노드 이름을 입력해주세요!</Box>}
                                    <Box h={260} overflowY="scroll">
                                        {searchResultDataLoading && <Box>데이터 불러오는 중...</Box>}
                                        {!searchResultDataLoading && searchResultData.map((result) => (
                                            <Button
                                                border="0px"
                                                borderBottom="1px"
                                                borderColor="gray.300"
                                                borderRadius="0px"
                                                bgColor={nodeSearchSelected && selectedData.contentid == result.contentid ? "blue.600" : "white"}
                                                color={nodeSearchSelected && selectedData.contentid == result.contentid ? "white" : "black"}
                                                _hover={{}}
                                                h="40px"
                                                key={result.contentid}
                                                onClick={(e) => onNodeSearchSelect(result)}
                                            >
                                                {/* {result.contentid} */}
                                                {result.title},&nbsp;
                                                {result.addr1},&nbsp;
                                                x: {result.mapx}, y: {result.mapy}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
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
                    p={3}
                    mr="260px"
                    w="240px"
                    minH="30px"
                    bgColor="#ffffff"
                    border={1}
                    borderRadius={4}
                    borderColor="gray"
                    textAlign="left"
                    boxShadow="2xl"
                >
                    <Box
                        display="flex"
                        alignItems="center"
                    >
                        <Box w="160px" fontWeight="semibold">편집할 Day</Box>
                        <Select value={currentDay} onChange={(e) => {
                            setCurrentDay(e.target.value)
                            // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
                            // dayManager.printStateData()
                        }}>
                            {dayModuleList.map((dayModule) => (
                                <option key={"option" + dayModule.id} value={dayModule.id} > Day {dayModule.id}</option>
                            ))}
                        </Select>
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
                    w="240px"
                    minH="300px"
                    maxH="92vh"
                    overflowY="scroll"
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
                                    // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
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
                                        // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
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
                                {dayModule.data.map((node, i) => {
                                    const _key = "day "+dayModule.id + ": node " + i
                                    // console.log(_key)
                                    // console.log(node)
                                    return(<Box key={_key}>
                                        <Box
                                            h={8}
                                            lineHeight={8}
                                            fontWeight="semibold"
                                            onClick={onNodeInfoOpen}
                                            _hover={{
                                                bgColor:"#00ff0033",
                                                transition:"all .3s"
                                            }}
                                        >
                                            {i+1}. {node.title}
                                        </Box>
                                        <Modal isOpen={isNodeInfoOpen} onClose={onNodeInfoClose}>
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalHeader>
                                                    Day {dayModule.id} - {i+1}번째 노드
                                                </ModalHeader>
                                                <ModalCloseButton />
                                                <ModalBody>
                                                    {node.title}<br />
                                                    {node.addr1}<br />
                                                    {node.visitDate}<br />
                                                    <Button onClick={() => {
                                                        onNodeInfoClose()
                                                        // const nextDayModuleList = dayModuleList
                                                        // nextDayModuleList.map(_dayModule => {
                                                        //     if(_dayModule.id == dayModule.id) {
                                                        //         const nextData = dayModule.data.filter((_node, _i) => !i == _i)
                                                        //         const nextDayModule = _dayModule
                                                        //         nextDayModule.data = nextData
                                                        //         return nextDayModule
                                                        //     }
                                                        //     else {
                                                        //         return _dayModule
                                                        //     }
                                                        // })
                                                        // setDayModuleList(nextDayModuleList)
                                                    }}>
                                                        노드 제거
                                                    </Button>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button onClick={onNodeInfoClose} colorScheme="teal">닫기</Button>
                                                </ModalFooter>
                                            </ModalContent>
                                        </Modal>
                                    </Box>)
                                })}

                                

                                <Box mt={4}>
                                    <Box fontWeight="semibold">리뷰</Box>
                                    <Textarea mt={2} value={reviews[dayModule.id-1]} boxShadow="2xl" onChange={(e) => {
                                        const nextReviews = reviews.map((review, i) => {
                                            if(i == dayModule.id-1) {
                                                return e.target.value
                                            }
                                            else {
                                                return review
                                            }
                                        })
                                        setReviews(nextReviews)
                                        console.log(nextReviews)
                                    }} />
                                </Box>
                            </Box>
                        </Box>
                    ))}
                    <Button
                        colorScheme="blue"
                        onClick={async (e) => {
                            setDayModuleList(
                                [
                                    ...dayModuleList,
                                    { id: nextDayMenuId, data: ["(replace with current node)"]}
                                ]
                            )
                            setReviews(
                                [
                                    ...reviews,
                                    "example"
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
                            setOnPlusDay(nextDayMenuId)
                            // dayManager.plusDay() // 이렇게 하면 plusDay 내에서 이전 currentDay 값 참조하게 됨
                            setNextDayMenuId(nextDayMenuId + 1)
                        }}>
                        Day 추가
                    </Button>

                    <Button onClick={() =>{
                        dayMana
                    }}
                </Box>
            </div >
            <div
                style={{
                    position: "fixed",
                    top: nodeMenuPosition.y,
                    left: nodeMenuPosition.x,
                    zIndex: nodeMenuOn ? 4 : -2,
                    transition: "z-index .1s linear"
                }}
            >
                <Box
                    visibility={nodeMenuOn ? "visible" : "hidden"}
                    bgColor="white"
                    borderRadius="2px"
                    w="200px"
                    maxH={nodeMenuOn ? "100vh" : "0vh"  }
                    overflowY="hidden"
                    opacity={nodeMenuOn ? "1" : "0"}
                    boxShadow="2xl"
                    textAlign="left"
                    p={4}
                    transition="all .6s ease-in-out .05s"
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

            <div ref={mapContainer} style={{ height: "100vh" }} />
            
        </CanvasContext.Provider>
    </>)
}

export default ReviewSpace