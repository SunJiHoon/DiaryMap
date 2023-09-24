import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearUser } from '../reducer/user_slice'
import { Box, Input, Button, Heading} from '@chakra-ui/react'
import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"

const MyTripmap = () => {


    const [isTest, setIsTest] = useState(false)
    
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
    const [xValue, setXValue] = useState('')
    const [yValue, setYValue] = useState('')
    
    const onNewReviewChange = useCallback((e) => {
        setNewReviewValue(e.target.value)
    }, [])

    const onXChange = useCallback((e) => {
        setXValue(e.target.value)
    }, [])

    const onYChange = useCallback((e) => {
        setYValue(e.target.value)
    }, [])

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
                    id: 1
                },
                {
                    title: "제주도 리뷰",
                    id: 2
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
                    <Input type="text" placeholder="새 리뷰 추가" value={newReviewValue} onChange={onNewReviewChange} />
                    <Input type="text" placeholder="x" value={xValue} onChange={onXChange} />
                    <Input type="text" placeholder="y" value={yValue} onChange={onYChange} />
                    <Button type="submit" ml={4}>추가</Button>
                    </Box>
                </Box>
            </form>
            <Box display="flex" justifyContent="center">
                <Box w="100%" maxW="500px">
                    {reviewData.map((review) => (
                        <Box border="1px" key={review.mapId} mb={6}>
                            {review.title}<br />
                            {review.mapId}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    </Box>
    )
}

export default MyTripmap