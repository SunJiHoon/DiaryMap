import './map.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button } from '@chakra-ui/react' 
import client from '../utility/client'
import { useSelector } from 'react-redux'

const testData = {
    reviews : [
        {
            x : 3,
            y : 3,
            reviewTitle: "부산 리뷰",
            reviewerName: "Kihun Jang",
            hart_count: 3,
        },
        {
            x : -2,
            y : 4,
            reviewTitle: "1박 2일 후쿠오카",
            reviewerName: "Test 2",
            hart_count: 1,
        },
        {
            x : 3,
            y : -2,
            reviewTitle: "환상같았던 교토 여행",
            reviewerName: "Test 3",
            hart_count: 4,
        },
    ],
}

const Map = () => {
    const username = useSelector((state) => state.user.name)
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPosition, setMenuPosition] = useState({x:0, y:0})
    const [menuData, setMenuData] = useState("")

    const [reviewDataVisible, setReviewDataVisible] = useState(false)
    const [reviewDataPosition, setReviewDataPosition] = useState({x:0, y:0})
    const [reviewData, setReviewData] = useState("")

    const divRef = useRef(null)
    const canvasRef = useRef(null)
    
    useEffect(() => {
        
        // init scene
        const aspect = {
            width: window.innerWidth,
            height: window.innerHeight,
        }

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xaaaaff)
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current
        })
        renderer.setSize(aspect.width, aspect.height)
        // const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        // const material = new THREE.MeshBasicMaterial({ color: 0xffff00})
        // const boxMesh = new THREE.Mesh(geometry, material)
        // boxMesh.position.set(0, 0, 1)
        // scene.add(boxMesh)

        const table = []
        const meshes = []
        client.get('/api/reviews',).then((res) => {
            const reviewData = res.data
            console.log(reviewData)
            for (const review of reviewData) {
                const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
                const material = new THREE.MeshBasicMaterial({ color: 0xffff00})
                const mesh = new THREE.Mesh(geometry, material)
                mesh.position.set(review.x, 0.25, review.y)
                scene.add(mesh)
                table.push({mesh, review})
                meshes.push(mesh)
            }
        })
        // for (const review of testData.reviews) {
        //     const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        //     const material = new THREE.MeshBasicMaterial({ color: 0xffff00})
        //     const mesh = new THREE.Mesh(geometry, material)
        //     mesh.position.set(review.x, 0.25, review.y)
        //     scene.add(mesh)
        //     table.push({mesh, review})
        //     meshes.push(mesh)
        // }

        const planeGeometry = new THREE.PlaneGeometry(10, 10)
        const mapMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff})
        const mapMesh = new THREE.Mesh(planeGeometry, mapMaterial)
        mapMesh.position.set(0, 0, 0)
        mapMesh.rotation.x = -90 * Math.PI / 180
        scene.add(mapMesh)
        
        const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height)
        camera.position.y = 5
        camera.position.z = 11
        const orbitControl = new OrbitControls(camera, canvasRef.current)


        // raycaster
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()
        let currentIntersect = null

        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / aspect.width) * 2 - 1
            mouse.y = -(event.clientY / aspect.height) * 2 + 1

            raycaster.setFromCamera(mouse, camera)
            
            const intersects = raycaster.intersectObjects(meshes)
            // for(const intersect of intersects ) {
            //     intersect.object.material.color.set("#ffffff")
            // }
            if(intersects.length) {
                
                if(!currentIntersect) {
                for(const intersect of intersects) {
                    intersect.object.material.color.set("#ffffff")
                }
                currentIntersect = intersects[0]
                const data = table.find(e => {
                    return e.mesh === currentIntersect.object
                })
                setReviewDataPosition({x: event.clientX-100, y: event.clientY-30})
                    // console.log(e.clientX, e.clientY)
                    
                setReviewData("제목 : " + data.review.reviewTitle + " - "+data.review.reviewerName + "님, 하트:" + data.review.hart_count)
                setReviewDataVisible(true)
            }
            }
            else {
                if(currentIntersect) {
                    currentIntersect.object.material.color.set("#ffff00")
                    currentIntersect = null
                    setReviewDataVisible(false)
                }
            }
        })

        const handleClick = (e) => {
            if(currentIntersect) {
                setMenuVisible(true)
                setMenuPosition({x: e.clientX, y: e.clientY})
                console.log(e.clientX, e.clientY)
                const data = table.find(e => {
                    return e.mesh === currentIntersect.object
                })
                setMenuData("제목 : " + data.review.reviewTitle + " - "+data.review.reviewerName + "님, 하트:" + data.review.hart_count)
                console.log(data.review)
            }
            else {
                setMenuVisible(false)
            }
        }

        const handleResize = () => {
            aspect.width = window.innerWidth
            aspect.height = window.innerHeight
            camera.aspect = aspect.width / aspect.height
            camera.updateProjectionMatrix()

            renderer.setSize(aspect.width, aspect.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }
        const divInstance = divRef.current
        if (divInstance) {
            divInstance.addEventListener('click', handleClick)
        }
        if (window) {
            window.addEventListener('resize', handleResize)
        }

        // animation
        let animationHandle
        const animate = () => {
            orbitControl.update()
            renderer.render(scene, camera)
            animationHandle = window.requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.cancelAnimationFrame(animationHandle)
            divInstance.removeEventListener('click', handleClick)
            window.removeEventListener('resize', handleResize)
            renderer.dispose()
        }
    }, [])

    return <>
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
            mt={4}
        >
            { username &&
                <Box>{username} 님, 안녕하세요!</Box>
            }
        </Box>
    </div>

    
    <Box
        visiblity={menuVisible ? "visible" : "hidden"}
        position="fixed"
        left={menuPosition.x}
        top={menuPosition.y}
        display="flex"
        flexDirection="column"
        opacity={menuVisible ? "1" : "0"}
        zIndex={menuVisible ? 1 : -1}
        transition="opacity 0.3s"
    >
        <Box
            w={24}
            borderRadius="4px"
            bgColor="white"
            display="flex"
            flexDirection="column"
            p={1}
            mt={2}
        >
        <Button onClick={() => console.log("menu1 clicked")} colorScheme="teal" variant="outline">메뉴1</Button>
        <Button mt={2} colorScheme="teal" variant="outline">메뉴2</Button>
        </Box>
    </Box>
    <Box
        visiblity={reviewDataVisible ? "visible" : "hidden"}
        position="fixed"
        left={reviewDataPosition.x}
        top={reviewDataPosition.y}
        display="flex"
        flexDirection="column"
        opacity={reviewDataVisible ? "1" : "0"}
        zIndex={reviewDataVisible ? 1 : -1}
        transition="opacity 0.1s"
    >
        <Box bgColor="white" fontWeight="semibold">{reviewData}</Box>
    </Box>

    

    <div ref={divRef} style={{zIndex: 0}}>
        <canvas ref={canvasRef}></canvas>
    </div>
    </>
}

export default Map