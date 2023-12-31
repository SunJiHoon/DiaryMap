import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../reducer/user_slice';
import axios from 'axios';
import { Box, Input, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import client from '../utility/client';

const SignUpBox = () => {
  const username = useSelector((state) => state.user.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginId, setId] = useState('');
  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {}, [msg]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginId) {
      setMsg('id is empty');
      return;
    } else if (!password) {
      setMsg('password is empty');
      return;
    }

    let body = {
      loginId,
      name,
      password,
    };

    client
      .post('/api/register', body) //register
      .then((res) => {
        console.log(res);
        console.log(res.data);
        console.log(loginId, name);
        if (res.status == 200) {
          // 회원가입 완료 문구 띄운 후 '홈으로' 버튼 누르면 돌아가게
          client
            .post('/api/login', body, { withCredentials: true }) //login
            .then((res) => {
              console.log(res);
              console.log(res.data);
              if (res.data.loginId == '-1') return;
              dispatch(loginUser(res.data));
              navigate('/');
            })
            .catch((error) => {
              console.log(error.response);
            });
        }
      });
  };

  return (
    <>
      <Box w={300}>
        {username && <p>logined as {username}</p>}
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setId(e.target.value)}
            boxShadow="md"
          />
          <Input
            type="text"
            placeholder="이름"
            mt={2}
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            boxShadow="md"
          />
          <Input
            type="password"
            placeholder="비밀번호"
            mt={2}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            boxShadow="md"
          />
          <Button w={300} type="submit" colorScheme="teal" mt={4} boxShadow="md">
            회원가입
          </Button>
        </form>
      </Box>
    </>
  );
};

export default SignUpBox;
