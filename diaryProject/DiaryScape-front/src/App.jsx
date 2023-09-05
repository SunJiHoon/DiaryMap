import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginBox from './components/login_box'
import { Provider } from 'react-redux'
import { store } from './app/store'
function App() {

  return (
    <>
      <div>
        <div>
          <Provider store={store}>
          <LoginBox />
          </Provider>
        </div>
      </div>
    </>
  )
}

export default App
