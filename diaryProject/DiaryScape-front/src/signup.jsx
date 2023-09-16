import SignUpBox from './components/signup_box'
import { Provider } from "react-redux"
import { store } from './app/store'
import { Link } from 'react-router-dom'
import { Box, Button} from '@chakra-ui/react'

const SignUp = () => {
    return (
        <Provider store={store}>
            <Box
                h="100vh"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
            <SignUpBox />
            <Link to='/'>
            <Button mt={2} w={300} colorScheme="teal" variant="outline">
                뒤로가기
            </Button>
            </Link>
            </Box>
        </Provider>
    )
}

export default SignUp