import { Link } from "react-router-dom"
import { Box, Center } from '@chakra-ui/react'
const Home = () => {
    return (
      <Center h="100vh">
        <Box p="6" maxW="300px" border="1px" borderColor="gray.200">
          <Link to="signup">
            <Box>회원가입</Box>
          </Link>
          <Link to ="signin">
            <Box>로그인</Box>
          </Link>
        </Box>
      </Center>
    )
}

export default Home
