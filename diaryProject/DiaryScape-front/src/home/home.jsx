import { Link } from "react-router-dom"
import { Box, Button, Center, Text, Heading } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import MyTripmap from "../my_tripmap/my_tripmap"
import LoginBox from "../components/login_box"
const Home = () => {

  const navigate = useNavigate()
  const username = useSelector((state) => state.user.name)
    return (<>
      {username && <MyTripmap />}
      {!username &&
      <Box h="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Box>
        <Box>
          <Heading
            color="teal"
          >
            Tong Tong<br />TripMap
          </Heading>
        </Box>
        <Box p={6} m={6} maxW={400} border="1px" borderColor="gray.200">
          <Box mt={2} mb={2}>
            <LoginBox />
          </Box>
          <Box>
            <Link to="signup">
              <Button colorScheme="teal" p={2} w={300} boxShadow="md">
                회원가입
              </Button>
            </Link>
          </Box>
          {/* <Box mt={2}>
            <Link to ="map">
              <Button colorScheme="teal" variant="outline" p={2} w={300}>
                맵 테스트
              </Button>
            </Link>
          </Box>
          <Box mt={2}>
            <Link to ="reviewspace">
              <Button colorScheme="teal" variant="outline" p={2} w={300}>
                리뷰 공간 테스트
              </Button>
            </Link>
          </Box>
          <Box mt={2}>
            <Link to ="my_tripmap">
              <Button colorScheme="teal" variant="outline" p={2} w={300}>
                내 Trip 맵 보기
              </Button>
            </Link>
          </Box> */}
        </Box>
        </Box>
      </Box>
      }
      </>
    )
}

export default Home
