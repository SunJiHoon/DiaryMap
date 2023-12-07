import * as THREE from 'three';
import LeftBar from '../components/left_bar';
import NodeSearchInReviewSpace from '../components/node_search_in_review_space';
import RightBar from '../components/right_bar';
import RightBarPageDay from '../components/right_bar_page_day';
import RightBarPageDiary from '../components/right_bar_page_diary';
import RecommendedNodeList from '../components/recommended_node_list';
import SurroundingNodeList from '../components/surrounding_node_list';
import NodeMenu from '../components/node_menu';
import MapStyleButtons from '../components/map_style_buttons';
import InputManager, { selectOption } from '../utility/manager/inputManager';
import ObjectManager from '../utility/manager/objectManager';
import SaveManager from '../utility/manager/saveManager';
import DayManager from '../utility/manager/dayManager';
import { useRef, useEffect, useState } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import {
  IoChevronForward,
  IoPencil,
  IoBook,
  IoChevronBack,
  IoHome,
  IoCubeOutline,
  IoSettings,
} from 'react-icons/io5';
import UserOptions from '../components/user_options';
import { useNavigate } from 'react-router-dom';
import { createContext } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { BallTriangle } from 'react-loader-spinner';
import client from '../utility/client';
import axios from 'axios';
import '../styles/custom.css';

export const CanvasContext = createContext();

var mapStyle = 'mapbox://styles/mapbox/streets-v12';
// var mapStyle = 'mapbox://styles/mapbox/outdoors-v11';
// var mapStyle = 'mapbox://styles/mapbox/light-v11';
// var mapStyle = 'mapbox://styles/mapbox/dark-v11';
// var mapStyle = 'mapbox://styles/mapbox/satellite-v11';
// var mapStyle = 'mapbox://styles/mapbox/navigation-day-v1';
// var mapStyle = 'mapbox://styles/mapbox/navigation-night-v1';

let nextReviewId = 2;

const ReviewSpace = () => {
  const [canvasState, setCanvasState] = useState(null);

  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const tripData = useSelector((state) => state.trip);
  const startnodeData = useSelector((state) => state.startnode);
  const username = useSelector((state) => state.user.name);

  const [isReadonly, setIsReadOnly] = useState(tripData.readOnly);
  // console.log(isReadonly);
  const newMapFunctionRef = useRef(null);
  const addNodeFunctionRef = useRef(null);
  const plusSearchNodeRef = useRef(null);
  const loadSearchOptionsRef = useRef(null);
  const updateReviewsRef = useRef(null);
  const getCurNodeRef = useRef(null);
  const passReviewsToDayManagerRef = useRef(null);
  const saveReviewsInSaveManager = useRef(null);
  const generateDiaryRef = useRef(null);
  const removeDayNodeRef = useRef(null);
  const onObjManagerNodeSearchSelectRef = useRef(null);
  const dayReady = useRef(false);
  const changeDayNodeIndexRef = useRef(null);
  const loadRecommendedOptionsRef = useRef(null);

  // const setStateDataRef = useRef(null)
  // const printStateDataRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true);
  const [nodeMenuOn, setNodeMenuOn] = useState(false);
  const [nodeMenuPosition, setNodeMenuPosition] = useState({ x: 0, y: 0 });

  const [selectOptionData, setSelectOptionData] = useState({});

  const [leftBarOpen, setLeftBarOpen] = useState(true);
  const [rightBarOpen, setRightBarOpen] = useState(true);
  const [rightBarPage, setRightBarPage] = useState(0);
  const [debugMenuOpen, setDebugMenuOpen] = useState(false);

  const [dayModuleList, setDayModuleList] = useState([
    { id: 1, data: ['day information'], edge: ['edge info'] },
  ]);
  const [reviews, setReviews] = useState(['리뷰를 작성해주세요...']);

  const [dayMenuOpenList, setDayMenuOpenList] = useState([false]);
  const [reviewMenuOpen, setReviewMenuOpen] = useState(true);
  const [dayCheckedList, setDayCheckedList] = useState([true]);
  const [nextDayMenuId, setNextDayMenuId] = useState(2);
  const [currentDay, setCurrentDay] = useState(1);
  const [onPlusDay, setOnPlusDay] = useState(1);

  const [searchValue, setSearchValue] = useState('');
  const [searchResultData, setSearchResultData] = useState([]);
  const [nodeSearchSelected, setNodeSearchSelected] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [searchResultDataLoading, setSearchResultDataLoading] = useState(false);
  const [totalReview, setTotalReview] = useState('일기를 생성해주세요!');

  const [surroundingNodeList, setSurroundingNodeList] = useState([]);
  const [selectedSurroundingNodeData, setSelectedSurroundingNodeData] = useState({});

  const [dayModuleSelected, setDayModuleSelected] = useState(false);
  const [dayModuleSelectedData, setDayModuleSelectedData] = useState(null);
  const [mapStyleValue, setMapStyleValue] = useState('streets-v12');

  const [nodeInfoData, setNodeInfoData] = useState({});

  const [curNode, setCurNode] = useState(null);

  const [mapStyle, setMapStyle] = useState('');

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
  const map = useRef(null);
  const mapContainer = useRef(null);

  let objectManager,
    saveManager,
    inputManager,
    dayManager = new DayManager();
  updateReviewsRef.current = dayManager.updateReviews;
  getCurNodeRef.current = dayManager.getCurNode;
  passReviewsToDayManagerRef.current = dayManager.setReviews;
  removeDayNodeRef.current = dayManager.removeDayNode;
  changeDayNodeIndexRef.current = dayManager.changeDayNodeIndex;

  dayManager.setStateSetter(
    setDayModuleList,
    setNextDayMenuId,
    setCurrentDay,
    setDayMenuOpenList,
    setDayCheckedList,
    setReviews,
    setTotalReview,
    setCurNode
  );

  dayManager.updateFromFrontData(
    dayModuleList,
    dayCheckedList,
    currentDay,
    nextDayMenuId,
    tripData
  );
  // console.log(tripData);

  useEffect(() => {
    // console.log(curNode);
  }, [curNode]);
  useEffect(() => {
    dayManager.updateFromFrontData(
      dayModuleList,
      dayCheckedList,
      currentDay,
      nextDayMenuId,
      tripData
    );
    dayManager.printStateData();
    // console.log(dayModuleList);
  }, [dayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData]);

  const plusDayInitial = useRef(false);
  useEffect(() => {
    if (!plusDayInitial.current) {
      plusDayInitial.current = true;
      // console.log('initial');
      return;
    }
    // dayReady.current = false
    dayManager.plusDay().then(() => {
      setReviews([...reviews, '리뷰를 작성해주세요...']);
      // dayReady.current = true
    });
  }, [onPlusDay]);

  useEffect(() => {
    dayCheckedList.map((dayChecked, i) => {
      if (dayChecked) dayManager.visibleDay(i);
      else dayManager.invisibleDay(i);
    });
  }, [dayCheckedList]);

  const updateReviews = () => {
    if (updateReviewsRef.current) {
      updateReviewsRef.current(reviews);
    }
  };

  const updateReviewsInitial = useRef(false);

  useEffect(() => {
    if (!updateReviewsInitial.current) {
      // console.log('initial');
      updateReviewsInitial.current = true;
      return;
    }

    updateReviews();
  }, [reviews]);

  useEffect(() => {
    // dayManager.dataPropagationTest()
    if (map.current) return;
    map.current = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [tripData.startX, tripData.startY],
      zoom: 19.5,
      pitch: 45,
      bearing: -17.6,
      container: mapContainer.current,
      antialias: true,
    });
    // console.log(map);
    // map.current.dragRotate.disable()
    // map.current.touchZoomRotate.disableRotation()
    map.current.addControl(
      new MapboxLanguage({
        defaultLanguage: 'ko',
      })
    );

    // let mglCameraPosition = new mapboxgl.MercatorCoordinate(0, 0, 0)

    // let req

    // function handleResize() {
    //     camera.aspect = window.innerWidth / window.innerHeight;
    //     camera.updateProjectionMatrix();

    //     renderer.setSize(window.innerWidth, window.innerHeight);
    //     renderer.render(scene, camera);
    // }

    const setMglCameraPosition = (x, y, z) => {
      const mglcamera = map.current.getFreeCameraOptions();
      mglcamera.position.x = x;
      mglcamera.position.y = y;
      mglcamera.position.z = z;
      map.current.setFreeCameraOptions(mglcamera);
    };

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
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

    let mapCustomLayer;

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

        this.camera = new THREE.Camera();
        // camera.rotation.y = Math.PI / 4;
        // camera.position.set(-35, 45, 45);
        // camera.lookAt(0, 0, 0);

        objectManager = new ObjectManager(
          this.scene,
          this.camera,
          tripData,
          startnodeData,
          setSurroundingNodeList
        );
        objectManager.newMap().then(() => {
          newMapFunctionRef.current = objectManager.newMap;
          loadSearchOptionsRef.current = objectManager.loadSearchOptions;
          onObjManagerNodeSearchSelectRef.current = objectManager.onNodeSearchSelect;
          loadRecommendedOptionsRef.current = objectManager.loadRecommendedOptions;

          saveManager = new SaveManager(tripData, setCurNode, map, setIsLoading);
          saveManager.setObjectManager(objectManager);
          dayManager.setSaveManager(saveManager);
          saveReviewsInSaveManager.current = saveManager.saveReviews;
          generateDiaryRef.current = saveManager.generateDiary;

          saveManager.checkIsFirst().then(() => {
            inputManager = new InputManager(
              this.camera,
              map,
              setMglCameraPosition,
              this.scene,
              nodeMenuOn,
              setNodeMenuOn,
              setNodeMenuPosition,
              selectOptionData,
              setSelectOptionData,
              tripData.readOnly
            );
            addNodeFunctionRef.current = selectOption;
            plusSearchNodeRef.current = inputManager.plusSearchNode;
          });
        });
        // this.renderer.setSize(window.innerWidth, window.innerHeight);

        // let _cameraPosition = map.getFreeCameraOptions().position;
        // cameraPosition.set(_cameraPosition.x, _cameraPosition.y, _cameraPosition.z)
        // if (inputManager) inputManager.setCameraPosition(cameraPosition)
        // }
        // init()
        this.renderer.autoClear = false;
        this.map = map;
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
            new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale)
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
        let newMglCameraPosition = new THREE.Vector4(
          freeCamera.position.x,
          freeCamera.position.y,
          freeCamera.position.z,
          1
        );
        if (inputManager)
          inputManager.setMglCameraPosition(
            new mapboxgl.MercatorCoordinate(
              newMglCameraPosition.x,
              newMglCameraPosition.y,
              newMglCameraPosition.z
            )
          );
        // console.log(camera.position)
        // console.log(newMglCameraPosition)
        newMglCameraPosition.applyMatrix4(l.invert());
        if (inputManager)
          inputManager.setMglCameraPositionTransformed(
            new mapboxgl.MercatorCoordinate(
              newMglCameraPosition.x,
              newMglCameraPosition.y,
              newMglCameraPosition.z
            )
          );

        this.map.triggerRepaint();
        // window.addEventListener("resize", handleResize);

        // anim();
      },
    };

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
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
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
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );
      map.current.addLayer(customLayer);
    });

    // dayManager = new DayManager()
    // setStateDataRef.current = dayManager.setStateData

    return () => {
      // cancelAnimationFrame(req)
      // window.removeEventListener("resize", handleResize)
      inputManager?.cleanup();
      map.current.remove();
    };
  }, []);

  const onResetButtonClick = () => {
    if (newMapFunctionRef.current) {
      newMapFunctionRef.current('spongebob');
    }
  };

  const onAddNodeButtonClick = () => {
    if (addNodeFunctionRef.current) {
      addNodeFunctionRef.current(selectOptionData);

      // console.log(dayModuleSelectedData);
      // console.log(selectOptionData);
      if (dayModuleSelected) {
        client
          .post(
            '/api/placeRecommend/setimportcount?importedMapId=' +
              dayModuleSelectedData.data.importedMapId +
              '&importedContentId=' +
              selectOptionData.select_option.userData.contentID +
              '&importedDate=' +
              dayModuleSelectedData.data.nodeDTO_for_updateArrayList[0].visitDate
          )
          .then((res) => {
            // console.log(res);
          });
      }
    }
  };

  const changeMapStyle = (style) => {
    setMapStyleValue(style);
    if (map.current) {
      map.current.setStyle('mapbox://styles/mapbox/' + style);
    }
  };

  const onPlusSearchNodeClick = (selectedNode) => {
    if (plusSearchNodeRef.current) {
      plusSearchNodeRef.current(selectedNode);
    }
  };

  const loadSearchOptions = (nodeInfoList) => {
    if (loadSearchOptionsRef.current) {
      loadSearchOptionsRef.current(nodeInfoList);
    }
  };

  const onNodeSearchSelect = (nodeData, i) => {
    setNodeSearchSelected(true);
    setSelectedData(nodeData);
    if (onObjManagerNodeSearchSelectRef.current) {
      onObjManagerNodeSearchSelectRef.current(i);
    }
  };

  let source;
  const onNodeSearch = (e) => {
    // setSearchValue(e.target.value)
    setNodeSearchSelected(false);
    // console.log(e.target.value)

    const searchValueReplaced = searchValue.replace(/ /g, '%20');
    // console.log('search: ' + searchValueReplaced);

    // console.log("axios get 요청 : " + "http://localhost:8080/api/openApi/start/list?userKeyword=" + searchValueReplaced)

    setSearchResultDataLoading(true);

    if (!dayManager) return;

    if (source) {
      source.cancel();
    }

    source = axios.CancelToken.source();

    client
      .get(
        'api/kakaoOpenApi/keywordAndCoord/list?mapId=' +
          tripData.mapId +
          '&userKeyword=' +
          searchValueReplaced +
          '&mapX=' +
          dayManager.getCurNode().userData.mapX +
          '&mapY=' +
          dayManager.getCurNode().userData.mapY,
        { cancelToken: source.token }
      )
      .then((res) => {
        setSearchResultDataLoading(false);
        setSearchResultData(res.data);
        // console.log(res.data)

        loadSearchOptions(res.data);
      });
  };

  return (
    <>
      <CanvasContext.Provider value={[canvasState, setCanvasState]}>
        {/* <Map /> */}
        {isLoading && (
          <div
            style={{
              backgroundColor: '#00000070',
              position: 'fixed',
              top: '0px',
              left: '0px',
              width: '100vw',
              height: '100vh',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="white"
              ariaLabel="ball-triangle-loading"
              wrapperClass={{}}
              wrapperStyle=""
              visible={true}
            />
          </div>
        )}
        <LeftBar leftBarOpen={leftBarOpen}>
          <Box
            mt={4}
            p={4}
            w="240px"
            minH="80px"
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
            <Box ml={2} fontSize="xl" display="flex">
              <Box fontWeight="semibold">{username}</Box>
              <Box mr={2}>님의</Box>
              <Box fontWeight="semibold">{tripData.title}</Box>
              {/* {console.log(tripData)} */}
            </Box>
            <NodeSearchInReviewSpace
              isReadonly={isReadonly}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onNodeSearch={onNodeSearch}
              searchResultDataLoading={searchResultDataLoading}
              nodeSearchSelected={nodeSearchSelected}
              onNodeSearchSelect={onNodeSearchSelect}
              selectedData={selectedData}
              onPlusSearchNodeClick={onPlusSearchNodeClick}
              searchResultData={searchResultData}
              dayModuleSelected={dayModuleSelected}
              dayModuleSelectedData={dayModuleSelectedData}
            />
          </Box>
          <IconButton
            h="60px"
            mt={8}
            colorScheme="teal"
            onClick={() => setLeftBarOpen(!leftBarOpen)}
            icon={leftBarOpen ? <IoChevronBack /> : <IoChevronForward />}
          />
        </LeftBar>

        <RightBar
          rightBarOpen={rightBarOpen}
          setRightBarOpen={setRightBarOpen}
          rightBarPage={rightBarPage}
          setRightBarPage={setRightBarPage}
          isReadonly={isReadonly}
        >
          {rightBarPage == 0 && (
            <RightBarPageDay
              isReadonly={isReadonly}
              nodeInfoData={nodeInfoData}
              setNodeInfoData={setNodeInfoData}
              reviews={reviews}
              setReviews={setReviews}
              currentDay={currentDay}
              setCurrentDay={setCurrentDay}
              dayCheckedList={dayCheckedList}
              setDayCheckedList={setDayCheckedList}
              dayModuleList={dayModuleList}
              setDayModuleList={setDayModuleList}
              dayMenuOpenList={dayMenuOpenList}
              setDayMenuOpenList={setDayMenuOpenList}
              setOnPlusDay={setOnPlusDay}
              reviewMenuOpen={reviewMenuOpen}
              setReviewMenuOpen={setReviewMenuOpen}
              nextDayMenuId={nextDayMenuId}
              setNextDayMenuId={setNextDayMenuId}
              getCurNodeRef={getCurNodeRef}
              changeDayNodeIndexRef={changeDayNodeIndexRef}
              saveReviewsInSaveManager={saveReviewsInSaveManager}
              removeDayNodeRef={removeDayNodeRef}
            />
          )}
          {rightBarPage == 1 && (
            <RecommendedNodeList
              dayModuleSelected={dayModuleSelected}
              dayModuleSelectedData={dayModuleSelectedData}
              setDayModuleSelected={setDayModuleSelected}
              setDayModuleSelectedData={setDayModuleSelectedData}
              getCurNodeRef={getCurNodeRef}
              tripData={tripData}
              curNode={curNode}
              loadRecommendedOptionsRef={loadRecommendedOptionsRef}
            />
          )}
          {rightBarPage == 2 && (
            <SurroundingNodeList
              surroundingNodeList={surroundingNodeList}
              selectedSurroundingNodeData={selectedSurroundingNodeData}
              setSelectedSurroundingNodeData={setSelectedSurroundingNodeData}
              plusSearchNodeRef={plusSearchNodeRef}
              curNode={curNode}
            />
          )}
          {rightBarPage == 3 && (
            <RightBarPageDiary
              isReadonly={isReadonly}
              totalReview={totalReview}
              setTotalReview={setTotalReview}
              generateDiaryRef={generateDiaryRef}
              tripData={tripData}
            />
          )}
          {rightBarPage == 4 && (
            <UserOptions
              tripData={tripData}
              mapStyleValue={mapStyleValue}
              setMapStyleValue={setMapStyleValue}
              changeMapStyle={changeMapStyle}
              isReadonly={isReadonly}
            />
          )}
        </RightBar>

        {/* <div
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '32px',
            zIndex: 2,
          }}
        >
          <MapStyleButtons changeMapStyle={changeMapStyle} />
        </div> */}

        <NodeMenu
          nodeMenuOn={nodeMenuOn}
          nodeMenuPosition={nodeMenuPosition}
          selectOptionData={selectOptionData}
          onAddNodeButtonClick={onAddNodeButtonClick}
        />

        <div ref={mapContainer} style={{ height: '100vh' }} />
      </CanvasContext.Provider>
    </>
  );
};

export default ReviewSpace;
