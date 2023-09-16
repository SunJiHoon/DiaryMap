import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './signin'
import SignUp from './signup'
import Home from './home'
import Map from './map'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element = {<Home />} />
          <Route path="signin" element = {<SignIn />} />
          <Route path="signup" element = {<SignUp />} />
          <Route path="map" element = {<Map />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
