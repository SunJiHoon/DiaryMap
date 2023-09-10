import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginBox from './components/login_box'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './signin'
import SignUp from './signup'
import Home from './home'
function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element = {<Home />} />
          <Route path="signin" element = {<SignIn />} />
          <Route path="signup" element = {<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
