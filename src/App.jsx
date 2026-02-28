
import { useEffect, useState } from 'react'


import StartScreen from "./components/StartScreen.jsx"
import Map from "./components/Map.jsx"
import { auth } from "./firebase.js"
import {onAuthStateChanged} from 'firebase/auth';


function App() {
  const [curStartDisplay, setCurStartDisplay] = useState(true);
  const [userId, setUserId] = useState();
  
  useEffect(() => {
    
    // if a user exists, display map
    // async function getUser(){

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      
    if (user) {
      setUserId(user.uid);
      setCurStartDisplay(false);
      console.log(user.uid, "user id");
    } else {
      setUserId(null);
      setCurStartDisplay(true);
      console.log("User is logged out.");
    }
    });


    // getUser();

    return () => unsubscribe();

    }, []);

  return (
    <>
    {curStartDisplay ? <StartScreen onDisplayStart={setCurStartDisplay}/> : undefined}
    {/* <Map myUserId={userId}></Map> */}
    {userId && <Map myUserId={userId} />}
    </>
  )
}

export default App