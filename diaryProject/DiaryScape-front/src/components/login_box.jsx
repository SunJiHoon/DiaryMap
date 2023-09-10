import React, { useState, useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { loginUser, clearUser } from '../reducer/user_slice'
import axios from 'axios'

const LoginBox = () => {

  const username = useSelector((state) => state.user.name)
  const dispatch = useDispatch()
  
  const [loginId, setId] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState("")
  const [msg, setMsg] = useState("")

  useEffect(() => {

  }, [msg])

  const handleLogin = (e) => {
    e.preventDefault()
    if( !loginId ) {
      setMsg("id is empty")
      return
    }
    else if( !password ) {
      setMsg("password is empty")
      return
    }

    let body = {
      loginId,
      password,
    }

    axios.post("http://localhost:8080/api/login", body, {withCredentials:true})//login
      .then((res) => {
        console.log(res.data)
        dispatch(loginUser(res.data))
      })
  }

  return (<>
    <div>
      <div style={{
        display: "flex",
        flexDirection: "column",
      }}>
        { username && <><p>{username}로 로그인함</p> <button onClick={clearUser}>로그아웃</button></> }
        <form onSubmit={handleLogin}>
          <input type="text" value={loginId} onChange={(e) => setId(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  </>)

}

export default LoginBox
