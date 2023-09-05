import React, { useState, useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { loginUser } from '../reducer/user_slice'
import axios from 'axios'

const LoginBox = () => {
  const user = useSelector((state) => state.user)
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

    axios.post("http://localhost:8080/api/login", body)//login
      .then((res) => {
        console.log(res.data)
        if(res.data.code == 200) {
          dispatch(loginUser(res.data.userInfo))
        }
      })
  }

  return (<>
    <div>
      <div style={{
        display: "flex",
        flexDirection: "column",
      }}>
        { user && <p>logined as {user.name}</p> }
        <form onSubmit={handleLogin}>
          <input type="text" value={loginId} onChange={(e) => setId(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">login</button>
        </form>
      </div>
    </div>
  </>)

}

export default LoginBox
