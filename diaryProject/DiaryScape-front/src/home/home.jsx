import { Link } from "react-router-dom"
import { Box, Button, Center, Text, Heading } from '@chakra-ui/react'

const Home = () => {
    return (
      <Box h="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Box>
        <Box>
          <Heading
            color="teal"
          >
            DiaryMap
          </Heading>
        </Box>
        <Box p={6} m={6} maxW={400} border="1px" borderColor="gray.200">
          <Box>
            <Link to="signup">
              <Button colorScheme="teal" p={2} w={300}>
                회원가입
              </Button>
            </Link>
          </Box>
          <Box mt={2}>
            <Link to ="signin">
              <Button colorScheme="teal" p={2} w={300}>
                로그인
              </Button>
            </Link>
          </Box>
          <Box mt={2}>
            <Link to ="map">
              <Button colorScheme="teal" variant="outline" p={2} w={300}>
                테스트
              </Button>
            </Link>
          </Box>
        </Box>
        </Box>
      </Box>
    )
}

export default Home
