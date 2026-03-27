import React, { useEffect, useContext } from 'react';
import { useState } from "react";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Firestore } from "../firebase.js"
import { doc, updateDoc } from "firebase/firestore";
import { PostContext } from '../services/PostContext.js';
import { getPostUser, setPostHasExit, getPostHasExit, boostSimilarPosts, countSimilarPosts } from '../services/postRepository.jsx';

// most on the map created by the user
export default function Post({ content, postId, isPostDelete }){
    const { setRefresh, navBack, setInPopUp, delPost, curMarker, myUserId } = useContext(PostContext);
    const [text, setText] = useState(content.postDisc);
    const [editing, setEditing] = useState(false);
    const [userPost, isUserPost] = useState(false);
    const [mood, setMood] = useState(content.mood);
    const [moodLvl, setMoodLvl] = useState(content.moodLvl);
    const [color, setColor] = useState(content.color);
    const [innerPostHasExit , setInnerPostHasExit] = useState(false);

    
    useEffect(() => {
        setInPopUp(true);
    }, []);

    // useEffect(() => {
  
    // const interval = setInterval(() => {
    //   console.log("Runs every X seconds");
      
    //   if(prePost){
    //     let output = decreasePostRadius(postId);

    //     if(output == true){
    //         // delPost(content.url);
    //         // curMarker.remove();
    //     }

    //   }else{
    //     postCalcRadius(postId);
    //   }
      

    // },1000 );
    // // }, (1000) * 60 );

    // return () => clearInterval(interval); // cleanup
    

    // }, [])

    useEffect(() => {
        async function getPostUserInner(){

            const postUser = await getPostUser(postId);
            if(postUser == myUserId){
               
                isUserPost(true);
            }
        }
        getPostUserInner();
    
    }, []);


    async function handleExit(){
        
        console.log("in exit: ", mood," ",  moodLvl," ",  myUserId)
        const has_exit = await getPostHasExit(postId);

        if(!has_exit){
            console.log("boost");
            boostSimilarPosts(postId, moodLvl, mood, myUserId);
            countSimilarPosts(postId, mood, myUserId);

            await setPostHasExit(postId);
        
        }

        
        setInPopUp(false);
    }

    function handleText(newText){
        const handleTextChange = async (e) => {
        setText(newText);
        
        const postRef = doc(Firestore, "posts", postId);
        await updateDoc(postRef, {
            postDisc: newText
        });
    }
    handleTextChange();
    setText(newText);
    }

    function handleMood(newMood){
        const handleMoodChange = async (e) => {
        setMood(newMood);
        
        const postRef = doc(Firestore, "posts", postId);
        await updateDoc(postRef, {
            mood: newMood
        });
    }
    handleMoodChange();
    handleColor(newMood);

    }

    function handleMoodLvl(newMoodLvl){
        const handleMoodLvlChange = async (e) => {
        setMoodLvl(newMoodLvl);
        
        const postRef = doc(Firestore, "posts", postId);
        await updateDoc(postRef, {
            moodLvl: newMoodLvl
        });
    }
    handleMoodLvlChange();

    }

    function handleColor(mood){
    console.log("mood in color:", mood);
        // const handleColorChange = async (e) => {
        //     setColor(color);
        //     let curColor = "None";
        //     const postRef = doc(Firestore, "posts", postId);
        //     await updateDoc(postRef, {
        //         color: color
        //     });
        // }

    let curColor;

    if (mood == 'Happy') {
        curColor = "#e5eb34";
    } else if (mood == 'Sad') {
        curColor = "#3443eb";
    } else if (mood == 'Anger') {
        curColor = "#eb4034";
    } else {
        curColor = "#34eb74";
    }

    setColor(curColor);

    const postRef = doc(Firestore, "posts", postId);
    updateDoc(postRef, { color: curColor });

    console.log("color in color:", curColor);

    // handleColorChange();

    }

    function handleDel(){
        delPost(content.url);
        curMarker.remove();
    }


    function changeRadius(){
        pass;
    }

    return(
    <>
    <div className="post-outer-box">
    <div className="post-box">
         <button onClick={() => { navBack(); handleDel(); }} style={{ pointerEvenets:"auto" }}>delete post</button>

         <Link to="/" >
            {(moodLvl != -1 && mood != "None" && text != " ") && (
            <button onClick={() => { handleExit(); setRefresh(r => r + 1); }} style={{ pointerEvenets:"auto" }}>X</button>
            )}
        </Link>

            <div class="post-inner-box-config">
            <div class="post-inner-box">

            <div>
            {editing ? ( <input type="text" value={text} onChange={(e) => { handleText(e.target.value); setText(e.target.value);}}
                onBlur={() => setEditing(false)}
                />
                ) : (
                <>
                {text}
                </>
                )}
            </div>
            {userPost ? <button onClick={() => setEditing(true)}>edit</button> : <></>}
            </div>
            </div>
<select
  value={mood} 
  onChange={(e) => { setMood(e.target.value); handleMood(e.target.value);}}
  style={{ padding: '8px', borderRadius: '6px' }}
>
  <option value="" disabled>Select a Mood</option>
  <option value="Happy">Happy</option>
  <option value="Sad">Sad</option>
  <option value="Anger">Anger</option>
  <option value="Surprise">Surprise</option>
  
</select>
    <div style={{ display: "flex", gap: "8px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => {setMoodLvl(n); handleMoodLvl(n);}}
            style={{
              fontWeight: moodLvl === n ? "bold" : "normal",
              outline: moodLvl === n ? "2px solid blue" : "none",
            }}
          >
            {n}
          </button>
        ))}
      </div>
      {moodLvl !== 0 && <p>{moodLvl}</p>}
    
    
    </div>
    </div>
    </>
    );
}