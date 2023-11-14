import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearUser } from '../reducer/user_slice'
import { selectTrip, clearTrip } from '../reducer/trip_slice'
import { selectStartnode, clearStartnode } from "../reducer/startnode_slice"
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
import axios from "axios"

const MyTripmap = () => {

    const navigate = useNavigate()


    const dispatch = useDispatch()

    const username = useSelector((state) => state.user.name)

    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    const [reviewData, setReviewData] = useState([])
    const [newReviewValue, setNewReviewValue] = useState([])
    const [newReviewDateValue, setNewReviewDateValue] = useState(`${year}-${month}-${date}`)
    const [searchValue, setSearchValue] = useState('')
    const [searchResultData, setSearchResultData] = useState([])
    const [startNodeSelected, setStartNodeSelected] = useState(false)
    const [selectedData, setSelectedData] = useState({})
    const [searchResultDataLoading, setSearchResultDataLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        client.get('/api/obj/list').then((res) => {
            setReviewData(res.data)
        })
    }, [])

    const onNewReviewChange = useCallback((e) => {
        setNewReviewValue(e.target.value)
    }, [])

    const onNewReviewDateChange = (e) => {
        setNewReviewDateValue(e.target.value)
    }

    let source
    const onSearch = ((e) => {

        if (source) {
            source.cancel()
        }

        source = axios.CancelToken.source()

        // setSearchValue(e.target.value)
        setStartNodeSelected(false)
        // console.log(e.target.value)

        const searchValueReplaced = searchValue.replace(/ /g, "%20")
        console.log("search: " + searchValueReplaced)

        // console.log("axios get 요청 : " + "http://localhost:8080/api/openApi/start/list?userKeyword=" + searchValueReplaced)

        setSearchResultDataLoading(true)
        client.get("api/kakaoOpenApi/onlyKeywordFirst/list?userKeyword=" + searchValue, { cancelToken: source.token })
            .then((res) => {
                setSearchResultDataLoading(false)
                setSearchResultData(res.data)
            })
    })

    const onStartNodeSelect = (nodeData) => {
        setStartNodeSelected(true)
        setSelectedData(nodeData)
    }

    const onReviewClicked = (review) => {
        console.log(review)
        dispatch(selectTrip({
            title: review.title,
            mapId: review.mapId,
            startX: review.mapX,
            startY: review.mapY,
            date: review.visitDate,
        }))
        dispatch(selectStartnode({
            reviewtitle: review.reviewtitle,
            mapId: review.mapId,
            contentId: review.contentId,
            contentTypeId: review.contentTypeId,
            title: review.title,
            tel: review.tel,
            mapx: review.mapX,
            mapy: review.mapY,
            relativeX: review.relativeX,
            relativeY: review.relativeY,
            addr1: review.addr1,
        }))
        navigate("/reviewspace")
    }

    const onNewReviewSubmit = useCallback((e) => {
        e.preventDefault()
        if (newReviewValue == "") {
            console.log("새 리뷰 제목 비어있음!")
            return
        }
        if (!startNodeSelected) {
            console.log("시작 장소 선택되지 않음!")
            return
        }
        const newReviewNameReplaced = newReviewValue.replace(/ /g, "%20")
        const addr1Replaced = selectedData.addr1.replace(/ /g, "%20")
        const telReplaced = selectedData.tel.replace(/ /g, "%20")
        const titleReplaced = selectedData.title.replace(/ /g, "%20")
        console.log(newReviewDateValue)
        client.post("/api/obj/create?mapName=" + newReviewNameReplaced
            + "&date=" + newReviewDateValue
            + "&addr1=" + addr1Replaced
            + "&relativeX=" + selectedData.relativeX
            + "&relativeY=" + selectedData.relativeY
            + "&contentid=" + selectedData.contentid
            + "&contentTypeId=" + selectedData.contentTypeId
            + "&tel=" + telReplaced
            + "&title=" + titleReplaced
            + "&mapx=" + selectedData.mapx
            + "&mapy=" + selectedData.mapy
            , {}, { withCredentials: true })
            .then((res) => {
                client.get('/api/obj/list').then((res) => {
                    setReviewData(res.data)
                })
            })

        setNewReviewValue('')
        setStartNodeSelected(false)
        onClose()
    })

   

    return (
        <Box p={6}>
            <Heading as="h2" size="xl" mb={6}>
                <Box display="inline" color="blue">{username}</Box>의 여행 리스트
            </Heading>
            <Button colorScheme="teal" variant="outline" mb={6} onClick={() => dispatch(clearUser())}>로그아웃</Button>
            <Box>

                <Button w="60%" maxW={500} colorScheme="teal" onClick={onOpen} mb={10}>새 여행 작성</Button>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>새 여행 추가</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <form onSubmit={onNewReviewSubmit} onKeyDown={(e) => {
                                if (e.code == "Enter") {
                                    e.preventDefault()
                                }
                            }}>
                                <Box display="flex" justifyContent="center">
                                    <Box display="flex" flexDirection="column" justifyContent="center" w="100%" maxW="500px" mt={2} mb={6}>
                                        <Input type="text" placeholder="새 여행 이름" value={newReviewValue} onChange={onNewReviewChange} mb={2} />
                                        <Input type="date" value={newReviewDateValue} onChange={onNewReviewDateChange} mb={2} />
                                        <Box display="flex" mb={2}>
                                            <Input
                                                type="text"
                                                placeholder="시작 장소"
                                                value={searchValue}
                                                onChange={(e) => { setSearchValue(e.target.value) }}
                                                mr={2}
                                            />
                                            <Button onClick={onSearch} colorScheme="teal" variant="outline">
                                                검색
                                            </Button>
                                        </Box>
                                        <Button type="submit" colorScheme="teal">여행 생성</Button>
                                    </Box>
                                </Box>
                            </form>

                            <Box display="flex" justifyContent="center" mb={2}>
                                <Box w="100%" maxW="500px" display="flex" flexDirection="column">
                                    <Box fontSize="1.4em" mb={2}>시작 장소 선택</Box>
                                    {/* {startNodeSelected && <Box>{selectedData.contentid}</Box>} */}
                                    {searchValue.length == 0 && <Box>장소 이름을 입력해주세요!</Box>}
                                    <Box h={260} overflowY="scroll">
                                        {searchResultDataLoading && <Box>데이터 불러오는 중...</Box>}
                                        {!searchResultDataLoading && searchResultData.map((result) => (
                                            <Button
                                                border="0px"
                                                borderBottom="1px"
                                                borderColor="gray.300"
                                                borderRadius="0px"
                                                bgColor={startNodeSelected && selectedData.contentid == result.contentid ? "blue.600" : "white"}
                                                color={startNodeSelected && selectedData.contentid == result.contentid ? "white" : "black"}
                                                _hover={{}}
                                                h="40px"
                                                key={result.contentid}
                                                onClick={(e) => onStartNodeSelect(result)}
                                            >
                                                {/* {result.contentid} */}
                                                {result.title},&nbsp;
                                                {result.addr1},&nbsp;
                                                {/* x: {result.mapx}, y: {result.mapy} */}
                                            </Button>
                                        ))}
                                    </Box>
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
                        {reviewData.map((review) => (<Box key={review.mapId} display="flex" mb={6}>
                            <Button w="100%" h="70px" mr={2} onClick={(e) => onReviewClicked(review)} colorScheme="teal" variant="outline">
                                <Box display="flex" flexDirection="column">
                                    <Box fontSize="1.6em" mb={1}>{review.reviewtitle}</Box>
                                    {/* <Box>
                                        mapId: {review.mapId} / 시작 좌표: ({review.mapX}, {review.mapY})
                                    </Box> */}
                                </Box>
                            </Button>
                            <Button onClick={() => {
                                client.post("api/obj/delete?mapId="+review.mapId).then((res) => {
                                    console.log("삭제됨")
                                })
                                client.get('/api/obj/list').then((res) => {
                                    setReviewData(res.data)
                                })
                            }}>
                                삭제
                            </Button>
                        </Box>))}
                        {reviewData.length == 0 && <p>새 여행을 작성해주세요!</p>}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default MyTripmap