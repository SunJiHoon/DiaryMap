import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div>
            <ul>
                <li>
                    <Link to="signup">회원가입</Link>
                </li>
                <li>
                    <Link to ="signin">로그인</Link>
                </li>
            </ul>
        </div>
    )
}

export default Home