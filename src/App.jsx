
import { useRef, useEffect, useState } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StartScreen from "./components/StartScreen.jsx"

function App() {
  const [curStartDisplay, setCurStartDisplay] = useState(true);
  
  return (
    <>
    {curStartDisplay ? <StartScreen onDisplayStart={setCurStartDisplay}/> : undefined}
    </>
  )
}

export default App
