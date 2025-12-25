
import { useRef, useEffect, useState } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import StartScreen from "./components/StartScreen.jsx"
import Map from "./components/Map.jsx"
import { auth } from "./firebase.js"

import {onAuthStateChanged} from 'firebase/auth';

function App() {
  const [curStartDisplay, setCurStartDisplay] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user, " User is logged in.");
        setCurStartDisplay(false);
      } else {
        console.log("User is logged out.");
        setCurStartDisplay(true);
        //setCurStartDisplay(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
    {curStartDisplay ? <StartScreen onDisplayStart={setCurStartDisplay}/> : undefined}
    <Map></Map>
    </>
  )
}

export default App
