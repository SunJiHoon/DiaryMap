import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './signin/signin';
import SignUp from './signup/signup';
import Home from './home/home';
import Map from './map/map';
import ReviewSpace from './reviewspace/reviewspace';
import MyTripmap from './my_tripmap/my_tripmap';
import OthersMap from './othersmap/othersmap';
import { Navigate } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/map" element={<Map />} />
        <Route path="/reviewspace" element={<ReviewSpace />} />
        {/* <Route path="/my_tripmap" element={<MyTripmap />} /> */}
        <Route path="/othersmap" element={<OthersMap />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
