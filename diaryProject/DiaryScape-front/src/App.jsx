import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <div>
        <div>
          <form>
            <div style={{
              display:"flex",
              flexDirection:"column",
            }}>
              <input type="text" />
              <input type="password" />
            </div>
            <div>
              <button type="submit">login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
