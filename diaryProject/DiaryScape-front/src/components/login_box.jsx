import React, { useState, useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { loginUser, clearUser } from '../reducer/user_slice'
import axios from 'axios'
import { Input, Button, Box } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

axios.defaults.withCredentials = true;//axios가 웹 브라우져 내에서 항상 캐시를 소유할 수 있게 변경


const LoginBox = () => {
  const axiosConfig = {
    baseURL: import.meta.env.VITE_API_URL
  }

  const client = axios.create(axiosConfig)

  const username = useSelector((state) => state.user.name)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

    client.post("/api/login", body, {withCredentials:true})//login
      .then((res) => {
        console.log(res.data)
        dispatch(loginUser(res.data))
        navigate("/my_tripmap")
      })
  }

  return (<>
      <Box
        w={300}
      >
        { username && <><p>{username}로 로그인함</p> <button onClick={clearUser}>로그아웃</button></> }
        <form onSubmit={handleLogin}>
          <Input type="text" placeholder="ID" value={loginId} onChange={(e) => setId(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} mt={2} />
          <Button w={300} type="submit" colorScheme="teal" mt={2}>로그인</Button>
        </form>
      </Box>
  </>)

}

export default LoginBox
