import React, { useEffect } from 'react';
import { useState } from "react";
import {useParams, BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { store, Firestore } from "../firebase.js"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import { useParams } from "react-router-dom";

import '../index.css'

// edit firestore elements of the post here from here

export default function Post({ content, isPost, postId, isPostDelete }){

    console.log("in POST");

    const storage = getStorage();
    
    const [imageUrl, setImageUrl] = useState(null);
    const [text, setText] = useState(content.postDisc);
    const [editing, setEditing] = useState(false);

    // const { id } = useParams();
    
    useEffect(() => {
        isPost(true);
    }, []);

    function handleExit(){
        isPost(false);
    }

    function handleDelete(){
        isPost(false);
    }

//    useEffect (() => {

//          const updatePosts = async () => {
       
//         const postRef = doc(Firestore, "posts", postId);

//         const docSnap = await getDoc(postRef);

//         const data = docSnap.data();

//         setPosts(data.photos);

//          }

//     updatePosts();

//     }, []);

    // const handleFileChange = async (e) => {
    //     const file = e.target.files[0];

    //     if(!file){
    //         return;
    //     }

    //     const fileRef = ref(store, "/" + postId);
    //     await uploadBytes(fileRef, file);
    //     const url = await getDownloadURL(fileRef);
    //     setImageUrl(url);

    //     const postRef = doc(Firestore, "posts", postId);
    //     await updateDoc(postRef, {
    //         photos: arrayUnion(url)
    //     });

    //     const docSnap = await getDoc(postRef);

    //     const data = docSnap.data();
    //     setPosts(data?.photos || []);  // safe default if undefined
    //     console.log("photo in: ", data?.photos);
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


    return(
    <>
    <div className="post-outer-box">

    <div className="post-box">

        {/* 
        {posts[0] ? (undefined) : (<input type="file" onChange={handleFileChange} accept="image/*"/>)}
        */}

         <button onClick={isPostDelete} style={{ pointerEvenets:"auto" }}>delete post</button>

         <Link to="/" >
            <button onClick={handleExit} style={{ pointerEvenets:"auto" }}>X</button>
         </Link>

            <div class="post-inner-box-config">
            <div class="post-inner-box">

            {/* {posts?.map(url => <img src={url} />)} */}

            {/* <p>{postDisc}</p> */}

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