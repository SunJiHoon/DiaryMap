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
import { IoChevronDown, IoChevronForward , IoRemove } from "react-icons/io5"
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
    const getCurNodeRef = useRef(null)
    const passReviewsToDayManagerRef = useRef(null)
    const saveReviewsInSaveManager = useRef(null)
    const generateDiaryRef = useRef(null)
    const removeDayNodeRef = useRef(null)
    const onObjManagerNodeSearchSelectRef = useRef(null)
    const dayReady = useRef(false)

    // const setStateDataRef = useRef(null)
    // const printStateDataRef = useRef(null)
    const [nodeMenuOn, setNodeMenuOn] = useState(false)
    const [nodeMenuPosition, setNodeMenuPosition] = useState({ x: 0, y: 0, })

    const [selectOptionData, setSelectOptionData] = useState({})

    const [leftBarOpen, setLeftBarOpen] = useState(true)
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
    const [ nodeInfoData, setNodeInfoData ] = useState({})

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
    const map = useRef(null)
    const mapContainer = useRef(null)

    let objectManager, saveManager, inputManager, dayManager = new DayManager();
    updateReviewsRef.current = dayManager.updateReviews
    getCurNodeRef.current = dayManager.getCurNode
    passReviewsToDayManagerRef.current = dayManager.setReviews
    removeDayNodeRef.current = dayManager.removeDayNode

    dayManager.setStateSetter(setDayModuleList, setNextDayMenuId, setCurrentDay, setDayMenuOpenList, setDayCheckedList)

    dayManager.updateFromFrontData(dayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
    // console.log(tripData);


    useEffect(() => {
        dayManager.updateFromFrontData(dayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
        dayManager.printStateData()
        console.log(dayModuleList)
    }, [dayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData])

    const plusDayInitial = useRef(false)
    useEffect(() => {
        if(!plusDayInitial.current) {
            plusDayInitial.current = true
            console.log("initial")
            return;
        }
        dayReady.current = false
        dayManager.plusDay().then(() => {
            setReviews(
                [
                    ...reviews,
                    "example"
                ]
            )
            dayReady.current = true
        })
    }, [onPlusDay])

    useEffect(() => {
        if(dayReady.current) {
            dayCheckedList.map((dayChecked, i) => {
                if(dayChecked) dayManager.visibleDay(i)
                else dayManager.invisibleDay(i)
            })
        }
    }, [dayCheckedList])


    const updateReviews = () => {
        if (updateReviewsRef.current) {
            updateReviewsRef.current(reviews)
        }
    }

    const updateReviewsInitial = useRef(false)

    useEffect(() => {
        
        if(!updateReviewsInitial.current) {
            console.log("initial")
            updateReviewsInitial.current = true
            return;
        }

        updateReviews()
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
                onObjManagerNodeSearchSelectRef.current = objectManager.onNodeSearchSelect

                saveManager = new SaveManager(tripData);
                saveReviewsInSaveManager.current = saveManager.saveReviews
                generateDiaryRef.current = saveManager.generateDiary

                
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
    
    const onNodeSearchSelect = (nodeData, i) => {
        setNodeSearchSelected(true)
        setSelectedData(nodeData)
        if(onObjManagerNodeSearchSelectRef.current) {
            onObjManagerNodeSearchSelectRef.current(i)
        }
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
                left: leftBarOpen ? "0" : "-260px",
                zIndex: "2",
                transition: "left 0.3s"
            }}>
                <Box
                    display="flex"
                    alignItems="center"
                >
                <Box
                    mt={4}
                    p={4}
                    w="240px"
                    bgColor="#ffffff"
                    // borderWidth={1}
                    borderRadius={4}
                    // borderColor="gray.300"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    marginLeft="1.6em"
                    boxShadow="2xl"
                >
                    <Box
                        w="100%"
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Button w="100%" colorScheme="gray" onClick={() => navigate("/")}>홈 화면으로</Button>
                    </Box>
                    {/* <Box mt={4}>
                        <Button onClick={onResetButtonClick} colorScheme="blue">
                            reset
                        </Button>
                    </Box> */}
                    <Box
                        maxW="100%"
                        mt={4}
                    >
                        <Input
                            w="100%"
                            type="text"
                            placeholder="노드 이름"
                            value={searchValue}
                            onChange={(e) => { setSearchValue(e.target.value) }}
                            mb={2} 
                        />
                        <Button w="100%" mb={2} onClick={onNodeSearch} colorScheme="teal">
                            노드 검색
                        </Button>
                        <Button w="100%" mb={2} onClick={() => {
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
                                    {/* {searchValue.length == 0 && <Box>노드 이름을 입력해주세요!</Box>} */}
                                    <Box h={260} overflowY="scroll">
                                        {searchResultDataLoading && <Box>데이터 불러오는 중...</Box>}
                                        {!searchResultDataLoading && searchResultData.map((result, idx) => (
                                            <Button
                                                key={result.contentid}
                                                border="0px"
                                                borderBottom="1px"
                                                borderColor="gray.300"
                                                borderRadius="0px"
                                                bgColor={nodeSearchSelected && selectedData.contentid == result.contentid ? "blue.600" : "white"}
                                                color={nodeSearchSelected && selectedData.contentid == result.contentid ? "white" : "black"}
                                                _hover={{}}
                                                h="40px"
                                                onClick={(e) => onNodeSearchSelect(idx, result)}
                                            >
                                                {/* {result.contentid} */}
                                                <Box fontWeight="semibold" mr={2}>{result.title}</Box>
                                                <Box fontWeight="medium">{result.addr1}</Box>
                                                {/* x: {result.mapx}, y: {result.mapy} */}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                    </Box>

                    {/* <Box
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
                    </Box> */}
                </Box>
                        <IconButton
                            h="60px"
                            colorScheme="teal"
                            onClick={() => setLeftBarOpen(!leftBarOpen)}
                            icon={<IoChevronForward />}
                        />
                </Box>
            </div>
            {/* <div style={{
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
                    // border={1}
                    borderRadius={4}
                    // borderColor="gray"
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
            </div> */}

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
                    // border={1}
                    borderRadius={4}
                    // borderColor="gray"
                    textAlign="left"
                    boxShadow="2xl"
                >
                    <Button
                        w="100%"
                        mb={2}
                        colorScheme="teal"
                        onClick={(e) => {
                            let curNode
                            if(getCurNodeRef.current) {
                                curNode = getCurNodeRef.current()
                                console.log(curNode)
                            }
                            setDayCheckedList(
                                [
                                    ...dayCheckedList,
                                    true
                                ]
                            )
                            setDayMenuOpenList(
                                [
                                    ...dayMenuOpenList,
                                    true
                                ]
                            )
                            setDayModuleList(
                                [
                                    ...dayModuleList,
                                    { id: nextDayMenuId, data: [curNode.userData]}
                                ]
                            )
                            setCurrentDay(nextDayMenuId)        
                            setOnPlusDay(nextDayMenuId)
                            // dayManager.plusDay() // 이렇게 하면 plusDay 내에서 이전 currentDay 값 참조하게 됨
                            setNextDayMenuId(nextDayMenuId + 1)
                        }}
                    >
                        Day 추가
                    </Button>
                    <Box
                        mb={2}
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
                    <Box mb={6} pt={2} pb={2} borderTop="1px" borderBottom="1px" borderColor="gray.300">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={2}
                        >
                            <Box fontSize="2xl">Day {currentDay}</Box>
                            <Checkbox defaultChecked isChecked={dayCheckedList[currentDay - 1]} onChange={(e) => {
                                const nextDayCheckedList = dayCheckedList.map((dayChecked, i) => {
                                    if (i + 1 == currentDay) {
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
                                icon={dayMenuOpenList[currentDay - 1] ? <IoRemove /> : <IoChevronDown />}
                                onClick={(e) => {
                                    const nextDayMenuOpenList = dayMenuOpenList.map((menuOpen, i) => {
                                        if (i + 1 == currentDay) {
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
                            visibility={dayMenuOpenList[currentDay - 1] ? "visible" : "hidden"}
                            opacity={dayMenuOpenList[currentDay - 1] ? "1" : "0"}
                            maxH={dayMenuOpenList[currentDay - 1] ? "100vh" : "0vh"}
                            mt={dayMenuOpenList[currentDay - 1] ? 1 : 0}
                            overflowX="auto"
                            transition="all 0.3s ease-in-out"
                        >
                            {dayModuleList[currentDay-1].data.map((node, i) => {
                                const _key = "day "+currentDay + ": node " + i
                                return(<Box key={_key}>
                                    <Box
                                        h={8}
                                        lineHeight={8}
                                        fontWeight="semibold"
                                        overflow="hidden"
                                        onClick={() => {
                                            setNodeInfoData({day: currentDay, idx: i, node})
                                            onNodeInfoOpen()}
                                        }
                                        _hover={{
                                            bgColor:"#00ff0033",
                                            transition:"all .3s"
                                        }}
                                    >
                                        {i+1}. {node.title}
                                    </Box>
                                    
                                </Box>)
                            })}
                            
                            

                            <Box mt={4}>
                                <Box fontWeight="semibold">리뷰</Box>
                                <Textarea mt={2} value={reviews[currentDay-1]} boxShadow="2xl" onChange={(e) => {
                                    const nextReviews = reviews.map((review, i) => {
                                        if(i == currentDay-1) {
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

                    { nodeInfoData && nodeInfoData.node && <Modal isOpen={isNodeInfoOpen} onClose={onNodeInfoClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>
                                Day {nodeInfoData.day} - {nodeInfoData.idx+1}번째 노드
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                {nodeInfoData.node.title}<br />
                                {nodeInfoData.node.addr1}<br />
                                {nodeInfoData.node.visitDate}<br />
                                <Button onClick={() => {
                                    onNodeInfoClose()
                                    if(removeDayNodeRef.current) removeDayNodeRef.current(nodeInfoData.day, nodeInfoData.idx+1)
                                }}>
                                    노드 제거
                                </Button>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={onNodeInfoClose} colorScheme="teal">닫기</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>}
                    
                    <Button
                        w="100%"
                        mb={2}
                        onClick={() => {
                        if(saveReviewsInSaveManager.current) {
                            saveReviewsInSaveManager.current()
                        }
                    }}>
                        리뷰 저장
                    </Button>
                    <Button
                        w="100%"
                        onClick={() => {
                        if(generateDiaryRef.current) {
                            generateDiaryRef.current().then((res) => {
                                console.log("일기 생성 결과:" + res)
                            })
                        }
                    }}>
                        일기 생성
                    </Button>
                </Box>
            </div >
            <div
                style={{
                    visibility: nodeMenuOn ? "visible" : "hidden",
                    position: "fixed",
                    top: nodeMenuPosition.y,
                    left: nodeMenuPosition.x,
                    zIndex: nodeMenuOn ? 4 : -2,
                    maxH: nodeMenuOn ? "100vh" : "0vh",
                    opacity: nodeMenuOn ? "1" : "0",
                    transition: "visibility .3s linear .3s, z-index .3s linear .3s, opacity .3s linear .3s, maxH .3s linear .3s"
                }}
            >
                <Box
                    bgColor="white"
                    borderRadius="2px"
                    w="200px"
                    overflowY="hidden"
                    boxShadow="2xl"
                    textAlign="left"
                    p={4}
                    // transition="all .4s ease-in-out .3s"
                >
                    <Box fontWeight="bold">노드 정보</Box>
                    {selectOptionData.select_option && <Box>
                        {selectOptionData.select_option.userData.title}<br />
                        {selectOptionData.select_option.userData.addr1}<br />
                        {selectOptionData.select_option.userData.tel}<br />
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