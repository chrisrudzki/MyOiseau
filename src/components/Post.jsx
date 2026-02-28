import '../index.css'
import React, { useEffect, useContext } from 'react';
import { useState } from "react";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Firestore } from "../firebase.js"
import { doc, updateDoc } from "firebase/firestore";
import { PostContext } from '../services/PostContext.js';
import { getPostUser } from '../services/postRepository.jsx';

// most on the map created by the user
export default function Post({ content, postId, isPostDelete }){
    const { setRefresh, navBack, setInPopUp, delPost, curMarker, myUserId } = useContext(PostContext);
    const [text, setText] = useState(content.postDisc);
    const [editing, setEditing] = useState(false);
    const [userPost, isUserPost] = useState(false);
    
    useEffect(() => {
        setInPopUp(true);
    }, []);

    useEffect(() => {

        async function getPostUserInner(){

            const postUser = await getPostUser(postId);
            if(postUser == myUserId){
               
                isUserPost(true);
            }

        }
        getPostUserInner();
    
    }, []);


    function handleExit(){
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

    function handleDel(){
        delPost(content.url);
        curMarker.remove();
    }

    return(
    <>
    <div className="post-outer-box">
    <div className="post-box">

         <button onClick={() => { navBack(); handleDel(); }} style={{ pointerEvenets:"auto" }}>delete post</button>

         <Link to="/" >
            <button onClick={() => { handleExit(); setRefresh(r => r + 1); }} style={{ pointerEvenets:"auto" }}>X</button>
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
    
    </div>
    </div>
    </>
    );
}