import SignUpBox from './components/signup_box'
import { Provider } from "react-redux"
import { store } from './app/store'
import { Link } from 'react-router-dom'
const SignUp = () => {
    return (
        <Provider store={store}>
            <SignUpBox />
            <Link to='/'>뒤로가기</Link>
        </Provider>
    )
}

export default SignUp