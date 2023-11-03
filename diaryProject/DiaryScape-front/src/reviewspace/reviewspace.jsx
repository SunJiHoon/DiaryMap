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


const ReviewSpace = () => {

    const navigate = useNavigate()
    const canvasRef = useRef(null)
    const tripData = useSelector((state) => state.trip)
    const startnodeData = useSelector((state) => state.startnode)
    let objectManager, saveManager, inputManager, dayManager;

    const newMapFunctionRef = useRef(null)
    const addNodeFunctionRef = useRef(null)
    // const setStateDataRef = useRef(null)
    const [nodeMenuOn, setNodeMenuOn] = useState(false)
    const [nodeMenuPosition, setNodeMenuPosition] = useState({ x: 0, y: 0, })

    const [selectOptionData, setSelectOptionData] = useState({})

    const [debugMenuOpen, setDebugMenuOpen] = useState(false)

    const [dayModuleList, setDayModuleList] = useState([{ id: 1, data: "day1 data" }])
    const [dayMenuOpenList, setDayMenuOpenList] = useState([false])
    const [dayCheckedList, setDayCheckedList] = useState([true])
    const [nextDayMenuId, setNextDayMenuId] = useState(2)
    const [currentDay, setCurrentDay] = useState(1)

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
            camera.lookAt(0, 0, 0);

            objectManager = new ObjectManager(scene, camera, tripData, startnodeData);
            await objectManager.newMap("spongebob");
            newMapFunctionRef.current = objectManager.newMap;
            saveManager = new SaveManager(tripData);
            saveManager.checkIsFirst().then(() => {
                inputManager = new InputManager(camera, scene, nodeMenuOn, setNodeMenuOn, setNodeMenuPosition, selectOptionData, setSelectOptionData)
                addNodeFunctionRef.current = selectOption
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            dayManager = new DayManager()
            // setStateDataRef.current = dayManager.setStateData
            dayManager.setStateData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId)
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
                <Select value={currentDay} onChange={(e) => setCurrentDay(e.target.value)}>
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
                    onClick={(e) => {
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
                    }}>
                    Day 추가
                </Button>
            </Box>
        </div >
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
    </>)
}

export default ReviewSpace