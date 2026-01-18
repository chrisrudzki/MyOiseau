import React from 'react';
import { useState } from "react";
import { auth } from "../firebase";
import '../index.css';

import {
  signInWithEmailAndPassword
} from 'firebase/auth';

// inital sign in screen
export default function SignIn({ onDisplayStart, onDisplayStartSub }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // put email and password into firebase
  const handleSubmit = async () => {
    setSubmittedData({ email, password });
    try{
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Submitted:', email, password);
      
    } catch (error) {
      setErrorMessage("Wrong e-mail or password, try again");
    }
  };

  const handleStartSubScreen = () => {onDisplayStartSub(false)};

  return (
    <>
    <button 
    class="log-screen-button"
    onClick={handleStartSubScreen}>Sign up</button>

    <div>
    <h1 style={{
      fontFamily: "Arial"}}
    >
    Sign in
    </h1>

    </div>
    <div class="sign-in-inner-box-config">
    <div class="sign-in-inner-box">

    <div class="sign-in-up-info-text">Email</div>

    <input class="sign-in-up-boxes"
        type="email"
        placeholder=""
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />


    <div style={{
        fontSize: "15px",
         textAlign: "left",
         fontFamily: "Arial"
        }}>Password</div>

    <input
        type="password"
        placeholder=""
        class="sign-in-up-boxes"
        
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

    <button style={{
    all: "unset",
    fontFamily: "Arial",   
    display: "inline-block", 
    cursor: "pointer",
    width: "200px",
    fontSize: "13px",
    textAlign: "left",
    marginTop: "-4px",
    paddingTop: "0px",
    marginBottom: "20px"
  }}>Forgot Password</button>

    <button style={{
      width: "100%"
    }}
    
    class="log-screen-button"
    onClick={handleSubmit}>Sign in</button>

  </div>

  </div>

  <p>{errorMessage}</p>

    </>
  );
}
