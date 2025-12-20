import React from 'react';
import { useState } from "react";
import { auth } from "../firebase";

import {
  signInWithEmailAndPassword
} from 'firebase/auth';

export default function SignIn({ onDisplayStart, onDisplayStartSub }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleSubmit = async () => {
    setSubmittedData({ email, password });
    try{
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Submitted:', email, password);
      
    } catch (error) {
      setErrorMessage("Wrong e-mail or password, try again");
      // setErrorMessage("invalid username or password");
      //console.("Failed:", error.code, error.message);
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const submitUser = async () => {

    await sleep(1000); 

    if (!auth.currentUser){
      console.error("needs to be signed in to make post");
      return;
    }
}

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

    <div style={{
        fontSize: "15px",
        textAlign: "left",
        fontFamily: "Arial"
        }}>Email</div>
    <input
        type="email"
        placeholder=""
        style={{
          paddingRight: "7px",
          paddingLeft: "7px",
          width: "100%",
          height: "24px",
          borderRadius: "1",  // makes corners perfectly square
          border: "none",
          outline: "none",
          paddingTop: "5px",
          paddingBottom: "5px",
          marginTop: "2px",
          marginBottom: "7px",
          fontWeight: "bold",
          boxSizing: "border-box"
        }}
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
        style={{
          paddingRight: "7px",
          paddingLeft: "7px",
          width: "100%",
          height: "24px",
          borderRadius: "1",  // makes corners perfectly square
          border: "none",
          outline: "none",
          paddingTop: "5px",
          paddingBottom: "5px",
          marginTop: "2px",
          marginBottom: "-1px",
          boxSizing: "border-box",
          fontWeight: "bold",
          textDecoration: "underline"
        }} 
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
