import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button } from '@chakra-ui/react' 

const Map = () => {
    const canvasRef = useRef()

    useEffect(() => {
        
        const aspect = {
            width: window.innerWidth,
            height: window.innerHeight,
        }

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xafafaf)
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current
        })
        renderer.setSize(aspect.width, aspect.height)
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial()
        const boxMesh = new THREE.Mesh(geometry, material)
        boxMesh.position.set(0, 0, 0)
        
        
        const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height)
        camera.position.z = 5
        const orbitControl = new OrbitControls(camera, canvasRef.current)
        scene.add(boxMesh)

        let animationHandle
        const animate = () => {
            renderer.render(scene, camera)
            animationHandle = window.requestAnimationFrame(animate)
        }

        animate()
        
        return () => {
            orbitControl.update()
            window.cancelAnimationFrame(animationHandle)
        }
    }, [])

    return <>
    <div style={{
        position:"fixed",
        top:"0",
        left:"0",
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
    <div>
        <canvas ref={canvasRef}></canvas>
    </div>
    </>
}

export default Map