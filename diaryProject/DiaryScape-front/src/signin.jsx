import { Provider } from "react-redux"
import { store } from './app/store'
import LoginBox from "./components/login_box"
import { Link } from "react-router-dom"
import { Box, Button } from '@chakra-ui/react'

const SignIn = () => {
    return (
        <Provider store={store}>
            <Box
                h="100vh"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
            <LoginBox />
            <Link to='/'>
            <Button mt={2} w={300} colorScheme="teal" variant="outline">
                뒤로가기
            </Button>
            </Link>
            </Box>
        </Provider>
    )
}

export default SignIn
