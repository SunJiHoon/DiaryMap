import { Provider } from "react-redux"
import { store } from './app/store'
import LoginBox from "./components/login_box"
import { Link } from "react-router-dom"
const SignIn = () => {
    return (
        <Provider store={store}>
            <LoginBox />
            <Link to='/'>뒤로가기</Link>
        </Provider>
    )
}

export default SignIn