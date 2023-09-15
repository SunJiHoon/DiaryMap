import React, { useState, useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { loginUser } from '../reducer/user_slice'
import axios from 'axios'
import { Box, Input, Button } from '@chakra-ui/react'

const SignUpBox = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  
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

    axios.post("http://localhost:8080/api/register", body) //register
      .then((res) => {
        console.log(res.data)
        if(res.data.code == 200) {
          dispatch(loginUser(res.data.userInfo))
        }
      })
  }

  return (<>
      <Box
        w={300}
      >
        { user && <p>logined as {user.name}</p> }
        <form onSubmit={handleLogin}>
          <Input type="text" placeholder="ID" value={loginId} onChange={(e) => setId(e.target.value)} />
          <Input type="text" placeholder="Username" value={name} onChange={(e) => setUsername(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button w={300} type="submit" colorScheme="teal" mt={2}>회원가입</Button>
          
        </form>
      </Box>
  </>)

}

export default SignUpBox
