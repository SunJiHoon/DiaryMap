import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearUser } from '../reducer/user_slice';
import { Input, Button, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import client from '../utility/client';

const LoginBox = () => {
  const username = useSelector((state) => state.user.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginId, setId] = useState('');
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
      password,
    };

    client
      .post('/api/login', body, { withCredentials: true }) //login
      .then((res) => {
        console.log(res.data);
        dispatch(loginUser(res.data));
      });
  };

  return (
    <>
      <Box w={300}>
        {username && (
          <>
            <p>{username}로 로그인함</p>{' '}
            <button onClick={() => dispatch(clearUser())}>로그아웃</button>
          </>
        )}
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setId(e.target.value)}
            boxShadow="md"
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mt={2}
            boxShadow="md"
          />
          <Button w={300} type="submit" colorScheme="teal" mt={4} boxShadow="md">
            로그인
          </Button>
        </form>
      </Box>
    </>
  );
};

export default LoginBox;
