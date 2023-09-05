import React, { useState, useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { loginUser } from '../reducer/user_slice'
import axios from 'axios'

const LoginBox = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState("")
  const [msg, setMsg] = useState("")

  useEffect(() => {

  }, [msg])

  const handleLogin = (e) => {
    e.preventDefault()
    if( !id ) {
      setMsg("id is empty")
      return
    }
    else if( !password ) {
      setMsg("password is empty")
      return
    }

    let body = {
      id,
      password,
    }

    axios.post("", body)
      .then((res) => {
        console.log(res.data)
        if(res.data.code == 200) {
          dispatch(loginUser(res.data.userInfo))
        }
      })
  }
  console.log(user.name)

  return (<>
    <div>
      <div style={{
        display: "flex",
        flexDirection: "column",
      }}>
        { user.name && <p>logined as {user.name}</p> }
        <form onSubmit={handleLogin}>
          <input type="id" value={id} onChange={(e) => setId(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">login</button>
        </form>
      </div>
    </div>
  </>)

}

export default LoginBox
