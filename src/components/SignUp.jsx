import React from 'react';
import { useState } from "react";
import { auth } from "../firebase.js";

import { doc, setDoc} from "firebase/firestore";

//auth
import { 
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

export default function SignUp({ onDisplayStart, onDisplayStartSub }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
  
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
      console.log("Failure:", cleanMessage, email, password);

    }
  };

  const handleStartScreen = () => {onDisplayStart(false)}
  
  const handleStartSubScreen = () => {onDisplayStartSub(true)}

  const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(user);
      } else {
        console.log("log in failed");
      }
    });
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

//   const submitUser = async () => {

//     await sleep(1000); 

//     if (!auth.currentUser){
//       console.error("ERROR!");
//       return;
//     }

//     try {
//     await setDoc(doc(Firestore, "users", auth.currentUser.uid), {
//       email: email,
//       username: "douglas",
//       born: 1811115
//     });
    
//     console.log("Document written with ID: ", auth.currentUser);
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }

//   }

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
    style={{
        fontSize: "15px",
         textAlign: "left",
         fontFamily: "Arial"
        }}
        >Email</div>
    <input
        type="email"
        placeholder=" "
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
          boxSizing: "border-box"}}
        
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

    <div
    style={{
        fontSize: "15px",
         textAlign: "left",
         fontFamily: "Arial"
        }}
    >Username</div>
    <input
        
        placeholder=" "
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
      />

    <div 
    style={{
        fontSize: "15px",
         textAlign: "left",
         fontFamily: "Arial"
        }}>Password</div>
    <input
        type="password"
        placeholder=" "
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />


    <div
    style={{
        fontSize: "15px",
         textAlign: "left",
         fontFamily: "Arial"
        }}
    >Comfirm Password</div>

    <input 
        type="password"
        placeholder=" "
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
        ></input>

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