
import { useRef, useEffect, useState } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StartScreen from "./components/StartScreen.jsx"
import { auth } from "./firebase.js"


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
      }
      //  setCurStartDisplay(false); // to take away start screen
    });
    return () => unsubscribe();
  }, []);
  
  return (
    <>
    {curStartDisplay ? <StartScreen onDisplayStart={setCurStartDisplay}/> : undefined}
    </>
  )
}

export default App
