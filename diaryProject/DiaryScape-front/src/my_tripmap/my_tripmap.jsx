import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearUser } from '../reducer/user_slice'
import { selectTrip, clearTrip } from '../reducer/trip_slice'
import { Box, Input, Button, Heading} from '@chakra-ui/react'
import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const MyTripmap = () => {

    const [isTest, setIsTest] = useState(true)
    const navigate = useNavigate()
    // true: 테스트 맵 데이터 사용
    // false: "api/my_tripmap"에 Get 요청 후 맵 데이터 가져옴.


    // 로그인은 일단 프론트에서만 수행하도록 구현함
    const dispatch = useDispatch()
    
    const testLoginData = {
        name:"Tester",
        loginId: "tester_id"
    }

    dispatch(loginUser(testLoginData))

    const username = useSelector((state) => state.user.name)

    

    const [reviewData, setReviewData] = useState([])
    const [newReviewValue, setNewReviewValue] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [searchResultData, setSearchResultData] = useState([])
    
    const onNewReviewChange = useCallback((e) => {
        setNewReviewValue(e.target.value)
    }, [])

    const onSearchChange = useCallback((e) => {
        setSearchValue(e.target.value)
        const searchValueReplaced = searchValue.replace(/ /g, "%20")
        console.log("axios get 요청 : " + "http://localhost:8080/api/openApi/start/list?userKeyword=" + searchValueReplaced)
        axios.get("http://localhost:8080/api/openApi/start/list?userKeyword=" + searchValueReplaced)
            .then((res) => {
                setSearchResultData(res.data)
            })
        //setSearchResultData([{contentid:"1", title:"title", addr1:"address", mapx:"a", mapy:"b"}])
    }, [])

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
        const newReviewNameReplaced = newReviewValue.replace(/ /g, "%20")
        console.log(newReviewNameReplaced+"&x="+xValue+"&y="+yValue)
        axios.post("http://localhost:8080/api/obj/create?mapName="+newReviewNameReplaced+"&x="+xValue+"&y="+yValue, {}, {withCredentials:true})
            .then((res) => {
                axios.get('http://localhost:8080/api/obj/list').then((res) => {
                    setReviewData(res.data)
                })
            })

        setNewReviewValue('')

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
            axios.get('http://localhost:8080/api/obj/list').then((res) => {
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
            <Heading as="h3" size="lg">여행 리뷰 맵 리스트</Heading>
            <form onSubmit={onNewReviewSubmit}>
                <Box display="flex" justifyContent="center">
                    <Box display="flex" justifyContent="center" w="100%" maxW="500px" mt={6} mb={6}>
                    <Input type="text" placeholder="새 리뷰 이름" value={newReviewValue} onChange={onNewReviewChange} />
                    <Input type="text" placeholder="시작 장소" value={searchValue} onChange={onSearchChange} />
                    <Button type="submit" ml={4}>추가</Button>
                    </Box>
                </Box>
            </form>
            
            <Box display="flex" justifyContent="center" mb={8}>
                <Box w="100%" maxW="500px" display="flex" flexDirection="column">
                    <Box fontSize="1.4em" mb={4}>시작 가능한 장소</Box>
                    {searchResultData.length == 0 && <Box>장소 이름을 입력해주세요!</Box>}
                    {searchResultData.map((result) => (
                        <Button colorScheme="teal" variant="outline" h="40px" key={result.contentid} mb={6}>
                            {result.title},&nbsp;
                            {result.addr1},&nbsp;
                            x: {result.mapx}, y: {result.mapy}
                        </Button>
                    ))}
                </Box>
            </Box>

            <Box display="flex" justifyContent="center">
                <Box w="100%" maxW="500px" display="flex" flexDirection="column">
                    <Box fontSize="1.8em" mb={4}>여행 리스트</Box>
                    {reviewData.map((review) => (
                        <Button border="1px" h="70px" key={review.mapId} mb={6} onClick={(e) => onReviewClicked(review)}>
                            {review.title}<br />
                            {review.mapId}<br />
                            startX: {review.startX}, startY: {review.startY}
                        </Button>
                    ))}
                </Box>
            </Box>
        </Box>
    </Box>
    )
}

export default MyTripmap