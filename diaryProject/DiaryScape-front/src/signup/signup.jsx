import SignUpBox from '../components/signup_box'
import { Provider } from "react-redux"
import { store } from '../app/store'
import { Link } from 'react-router-dom'
import { Box, Heading, Button} from '@chakra-ui/react'

const SignUp = () => {
    return (
        <Provider store={store}>
            <Box
                h="90vh"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Box mb={4}>
                    <Heading
                        color="teal"
                        fontSize="2xl"
                        mb={2}
                    >
                        Tong Tong<br />TripMap
                    </Heading>
                    
                    <Heading
                        color="teal"
                        fontSize="4xl"
                        mb={4}
                    >
                        회원가입
                    </Heading>
                    {/* <Heading
                        h={2}
                        color="teal"
                    >
                        회원가입
                    </Heading> */}
                </Box>
                <Box p={6} border="1px" borderColor="gray.200">
                    <SignUpBox />
                    <Link to='/'>
                        <Button mt={2} w={300} colorScheme="teal" variant="outline" boxShadow="md">
                            뒤로가기
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Provider>
    )
}

export default SignUp