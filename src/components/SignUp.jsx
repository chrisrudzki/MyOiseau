import React from 'react';
import { useState } from "react";
import { auth } from "../firebase.js";
import '../App.css';

import { 
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

// inital sign up screen
export default function SignUp({ onDisplayStart, onDisplayStartSub }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const createAccount = async () => {
    setSubmittedData({ email, password });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Sucsess:", email, password);
    }
    catch(error) {
      const rawMessage = error?.message ? String(error.message) : String(error);
      const match = rawMessage.match(/^Firebase:\s*(.+?)\s*\(/);
      const cleanMessage = match ? match[1] : rawMessage;
      setErrorMessage("invalid username or password");

    }
  };

  const handleStartSubScreen = () => {onDisplayStartSub(true)}

  return (
    <>
    <button 
    class="log-screen-button"
    onClick={handleStartSubScreen} >Sign In</button>

    <h1 style={{
      fontFamily: "Arial"}}>
    Sign up
    </h1>

    <div class="sign-in-inner-box-config">
    <div class="sign-in-inner-box">

    <div
        class="sign-in-up-info-text"
        >Email</div>
    <input
        class='sign-in-up-boxes'
        
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

    {/* <div
    class="sign-in-up-info-text"
    >Username</div>
    <input
        
        placeholder=" "
        class='sign-in-up-boxes'
        
      /> */}

    <div 
    class="sign-in-up-info-text">Password</div>
    <input
        type="password"
        placeholder=" "
        class='sign-in-up-boxes'
        
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />


    {/* <div
    class="sign-in-up-info-text"
    >Comfirm Password</div>

    <input 
        type="password"
        placeholder=" "
        class='sign-in-up-boxes'
        
    ></input> */}

        <p>{errorMessage}</p>

    <button 
    style={{
      width: "100%",
      marginTop: "20px"
    }}

    class="log-screen-button"
    onClick={() => {createAccount();}}>Sign Up</button>

    </div>
    </div>
      
    </>
  );
}