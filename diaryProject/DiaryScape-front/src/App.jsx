import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './signin/signin'
import SignUp from './signup/signup'
import Home from './home/home'
import Map from './map/map'
import ReviewSpace from './reviewspace/reviewspace'
import MyTripmap from './my_tripmap/my_tripmap'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element = {<Home />} />
          <Route path="signin" element = {<SignIn />} />
          <Route path="signup" element = {<SignUp />} />
          <Route path="map" element = {<Map />} />
          <Route path="reviewspace" element = {<ReviewSpace />} />
          <Route path="my_tripmap" element = {<MyTripmap />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
