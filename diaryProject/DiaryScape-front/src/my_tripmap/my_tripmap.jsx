import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearUser } from '../reducer/user_slice'
import { selectTrip, clearTrip } from '../reducer/trip_slice'
import {
    Box,
    Input,
    Button, 
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react'
import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import client from "../utility/client"

const MyTripmap = () => {

    const [isTest, setIsTest] = useState(false)
    const navigate = useNavigate()
    // true: 테스트 맵 데이터 사용
    // false: "api/my_tripmap"에 Get 요청 후 맵 데이터 가져옴.


    const dispatch = useDispatch()
    
    // const testLoginData = {
    //     name:"Tester",
    //     loginId: "tester_id"
    // }

    //dispatch(loginUser(testLoginData))

    const username = useSelector((state) => state.user.name)

    

    const [reviewData, setReviewData] = useState([])
    const [newReviewValue, setNewReviewValue] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [searchResultData, setSearchResultData] = useState([])
    const [startNodeSelected, setStartNodeSelected] = useState(false)
    const [selectedData, setSelectedData] = useState({})
    const [searchResultDataLoading, setSearchResultDataLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const onNewReviewChange = useCallback((e) => {
        setNewReviewValue(e.target.value)
    }, [])

    // 불필요한 get 요청 방지 구현 예정
    const onSearchChange = useCallback((e) => {
        setSearchValue(e.target.value)
        setStartNodeSelected(false)
        // console.log(e.target.value)
        const searchValueReplaced = e.target.value.replace(/ /g, "%20")
        // console.log("axios get 요청 : " + "http://localhost:8080/api/openApi/start/list?userKeyword=" + searchValueReplaced)
        
        setSearchResultDataLoading(true)
        client.get("/api/openApi/start/list?userKeyword=" + searchValueReplaced)
            .then((res) => {
                setSearchResultDataLoading(false)
                setSearchResultData(res.data)
            })

        // setSearchResultData([
        //     {contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"},
        //     {contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"},
        //     {contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"},
        //     {contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"},
        //     {contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"},
        //     {contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"},
        //     {contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"},
        //     {contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"},
        //     {contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"},
        //     {contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"},
        // ])
    }, [])

    const onStartNodeSelect = (nodeData) => {
        setStartNodeSelected(true)
        setSelectedData(nodeData)
    }

    const onReviewClicked = (review) => {
        console.log(review)
        dispatch(selectTrip({
            title: review.title,
            mapId: review.mapId,
            startX: review.startX,
            startY: review.startY,
        }))
        navigate("/reviewspace")
    }

    const nextId = useRef(3)
    const onNewReviewSubmit = useCallback((e) => {
        e.preventDefault()
        // setReviewData(reviewData.concat({
        //     title: newReviewValue,
        //     id: nextId.current
        // }))
        if(newReviewValue=="") {
            console.log("새 리뷰 제목 비어있음!")
            return
        }
        if(!startNodeSelected) {
            console.log("시작 장소 선택되지 않음!")
            return
        }
        const newReviewNameReplaced = newReviewValue.replace(/ /g, "%20")
        console.log("post 요청: api/obj/create?mapName="+newReviewNameReplaced+"&x="+selectedData.mapx+"&y="+selectedData.mapy)
        client.post("/api/obj/create?mapName="+newReviewNameReplaced+"&x="+selectedData.mapx+"&y="+selectedData.mapy, {}, {withCredentials:true})
            .then((res) => {
                client.get('/api/obj/list').then((res) => {
                    setReviewData(res.data)
                })
            })

        setNewReviewValue('')
        setStartNodeSelected(false)
        nextId.current++
    })

    useEffect(() => {
        if(isTest) {
            setReviewData([
                {
                    title: "부산 리뷰",
                    mapId: 1,
                    startX: 1,
                    startY: 1,
                },
                {
                    title: "제주도 리뷰",
                    mapId: 2,
                    startX: -2,
                    startY: -2,
                }
            ])
            console.log(reviewData)
        }
        else {
            client.get('/api/obj/list').then((res) => {
                setReviewData(res.data)
            })
        }
    }, [])

    return (
    <Box p={6}>
        <Heading as="h2" size="xl">
            <Box display="inline" color="blue">{username}</Box>의 Trip Zone
        </Heading>
        <Box>
            <Heading as="h3" size="lg" mb={10}>여행 리뷰 맵 리스트</Heading>

            <Button w="60%" maxW={500} colorScheme="teal" onClick={onOpen} mb={10}>새 여행 작성</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>새 여행 추가</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={onNewReviewSubmit}>
                            <Box display="flex" justifyContent="center">
                                <Box display="flex" justifyContent="center" w="100%" maxW="500px" mt={6} mb={6}>
                                <Input type="text" placeholder="새 여행 이름" value={newReviewValue} onChange={onNewReviewChange} />
                                <Input type="text" placeholder="시작 장소" value={searchValue} onChange={onSearchChange} />
                                <Button type="submit" colorScheme="teal" ml={4}>추가</Button>
                                </Box>
                            </Box>
                        </form>
                        
                        <Box display="flex" justifyContent="center" mb={8}>
                            <Box w="100%" maxW="500px" display="flex" flexDirection="column">
                                { !startNodeSelected && <>
                                <Box fontSize="1.4em" mb={4}>시작 가능한 장소</Box>
                                {searchValue.length == 0 && <Box>장소 이름을 입력해주세요!</Box>}
                                {searchResultDataLoading && <Box>데이터 불러오는 중...</Box>}
                                <Box maxH={300} overflowY="scroll">
                                    {searchResultData.map((result) => (
                                        <Button colorScheme="teal" variant="outline" h="40px" key={result.contentid} mb={2} onClick={(e) => onStartNodeSelect(result)}>
                                            {result.title},&nbsp;
                                            {result.addr1},&nbsp;
                                            x: {result.mapx}, y: {result.mapy}
                                        </Button>
                                    ))}
                                </Box>
                                </>}
                                
                                { startNodeSelected && <>
                                <Box fontSize="1.4em" mb={4}>시작 장소 선택됨</Box>
                                <Button colorScheme="teal" h="40px" mb={2}>
                                    {selectedData.title},&nbsp;
                                    {selectedData.addr1},&nbsp;
                                    x: {selectedData.mapx}, y: {selectedData.mapy}
                                </Button>
                                </>}
                            </Box>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} colorScheme="teal">닫기</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Box display="flex" justifyContent="center" mb={10}>
                <Box w="100%" maxW="500px" display="flex" flexDirection="column">
                    <Box fontSize="1.8em" mb={4}>여행 리스트</Box>
                    {reviewData.map((review) => (
                        <Button border="1px" h="70px" key={review.mapId} mb={6} onClick={(e) => onReviewClicked(review)}>
                            {review.title}<br />
                            {review.mapId}<br />
                            startX: {review.startX}, startY: {review.startY}
                        </Button>
                    ))}
                    {reviewData.length == 0 && <p>새 여행을 작성해주세요!</p>}
                </Box>
            </Box>
        </Box>
        <Button colorScheme="teal" variant="outline" onClick={() => navigate("/")}>홈으로</Button>
    </Box>
    )
}

export default MyTripmap