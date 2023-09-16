import './map.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button } from '@chakra-ui/react' 
import axios from 'axios'

const testData = {
    reviews : [
        {
            x : 10,
            y : 10,
            reviewerId: "kihun",
            reviewerName: "Kihun Jang",
            reviewNum: 3,
        },
        {
            x : 10,
            y : 20,
            reviewerId: "testid2",
            reviewerName: "Test 2",
            reviewNum: 1,
        },
        {
            x : 30,
            y : 30,
            reviewerId: "testid3",
            reviewerName: "Test 3",
            reviewNum: 4,
        },
    ],
}

const Map = () => {
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPosition, setMenuPosition] = useState({x:0, y:0})
    const [menuData, setMenuData] = useState({})

    const canvasRef = useRef()
    
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
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00})
        const boxMesh = new THREE.Mesh(geometry, material)
        boxMesh.position.set(0, 0, 0)
        
        
        const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height)
        camera.position.z = 5
        const orbitControl = new OrbitControls(camera, canvasRef.current)
        scene.add(boxMesh)


        // raycaster
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()
        let currentIntersect = null

        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / aspect.width) * 2 - 1
            mouse.y = -(event.clientY / aspect.height) * 2 + 1

            raycaster.setFromCamera(mouse, camera)
            
            const intersects = raycaster.intersectObjects([boxMesh])
            // for(const intersect of intersects ) {
            //     intersect.object.material.color.set("#ffffff")
            // }
            if(intersects.length) {
                if(!currentIntersect) {
                for(const intersect of intersects) {
                    intersect.object.material.color.set("#ffffff")
                }
                currentIntersect = intersects[0]
            }
            }
            else {
                if(currentIntersect) {
                    currentIntersect.object.material.color.set("#ffff00")
                    currentIntersect = null
                }
            }
        })

        const handleClick = (e) => {
            if(currentIntersect) {
                setMenuVisible(true)
                setMenuPosition({x: e.clientX, y: e.clientY})
                console.log(e.clientX, e.clientY)

                switch(currentIntersect.object) {
                    case boxMesh:
                        console.log('boxMesh clicked')
                        break
                }
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

        window.addEventListener('click', handleClick)
        window.addEventListener('resize', handleResize)


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
            window.removeEventListener('click', handleClick)
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
    </div>

    
    <Box
        visiblity={menuVisible ? "visible" : "hidden"}
        position="fixed"
        left={menuPosition.x}
        top={menuPosition.y}
        display="flex"
        flexDirection="column"
        opacity={menuVisible ? "1" : "0"}
        transition="opacity 0.3s"
    >
        <Button>menu1</Button>
        <Button>menu2</Button>
    </Box>
    

    <div>
        <canvas ref={canvasRef}></canvas>
    </div>
    </>
}

export default Map