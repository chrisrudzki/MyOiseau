import React, { useEffect, useContext } from 'react';
import { useState } from "react";
import { useParams, BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { store, Firestore } from "../firebase.js"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

import { PostContext } from '../services/PostContext.js';
// import { useParams } from "react-router-dom";

import '../index.css'
// edit firestore elements of the post here from here

export default function Post({ content, postId, isPostDelete }){
    const { setRefresh, navBack, setInPost, delPost, curMarker } = useContext(PostContext);

    console.log("cur marker", curMarker);

    const storage = getStorage();
    
    // const [imageUrl, setImageUrl] = useState(null);
    const [text, setText] = useState(content.postDisc);
    const [editing, setEditing] = useState(false);

    // const { id } = useParams();


    
    useEffect(() => {
        setInPost(true);
    }, []);

    function handleExit(){

        setInPost(false);
        console.log("is post false");
    }

    // function handleDelete(){
    //     setInPost(false);
    // }

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

        console.log("got here !!!");
        delPost(content.url);
        curMarker.remove();


    }

    // function handleRefresh(){
    //     () => {setRefresh(r => r + 1)}
    // }

    return(
    <>
    <div className="post-outer-box">
    <div className="post-box">

        {/* 
        {posts[0] ? (undefined) : (<input type="file" onChange={handleFileChange} accept="image/*"/>)}
        */}

         <button onClick={() => { navBack(); handleDel(); }} style={{ pointerEvenets:"auto" }}>delete post</button>

         <Link to="/" >
            <button onClick={() => { handleExit(); setRefresh(r => r + 1); }} style={{ pointerEvenets:"auto" }}>X</button>
         </Link>

            <div class="post-inner-box-config">
            <div class="post-inner-box">

            <div>
            {editing ? ( <input type="text" value={text} onChange={(e) => { handleText(e.target.value); setText(e.target.value);}}
                onBlur={() => setEditing(false)} // exit edit mode when focus leaves autoFocus 
                />
                ) : (
                <>
                {text}
                </>
                )}
            </div>
                <button onClick={() => setEditing(true)}>edit</button>
            </div>
            </div>
    
    </div>
    </div>
    </>
    );
}