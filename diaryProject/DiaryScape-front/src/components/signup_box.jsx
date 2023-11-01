import React, { useState, useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { loginUser } from '../reducer/user_slice'
import axios from 'axios'
import { Box, Input, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import client from '../utility/client'

const SignUpBox = () => {
  const username = useSelector((state) => state.user.name)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [loginId, setId] = useState("")
  const [name, setUsername] = useState("")
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
      name,
      password,
    }

    client.post("/api/register", body) //register
      .then((res) => {
        console.log(res.data)
        if(res.data.code==200) { // 회원가입 완료 문구 띄운 후 '홈으로' 버튼 누르면 돌아가게
          dispatch(loginUser(res.data.userInfo))
          navigate("/")
        }
      })
  }

  return (<>
      <Box
        w={300}
      >
        { username && <p>logined as {username}</p> }
        <form onSubmit={handleLogin}>
          <Input type="text" placeholder="ID" value={loginId} onChange={(e) => setId(e.target.value)} boxShadow="md" />
          <Input type="text" placeholder="Username" mt={2} value={name} onChange={(e) => setUsername(e.target.value)} boxShadow="md" />
          <Input type="password" placeholder="Password" mt={2} value={password} onChange={(e) => setPassword(e.target.value)} boxShadow="md" />
          <Button w={300} type="submit" colorScheme="teal" mt={2} boxShadow="md">회원가입</Button>
          
        </form>
      </Box>
  </>)

}

export default SignUpBox
