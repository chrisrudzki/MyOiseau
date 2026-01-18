import '../index.css'
import React, { useEffect, useContext } from 'react';
import { useState } from "react";
import { BrowserRouter as Router, Link } from 'react-router-dom';
// import { getStorage } from "firebase/storage";
import { Firestore } from "../firebase.js"
import { doc, updateDoc } from "firebase/firestore";
import { PostContext } from '../services/PostContext.js';


export default function Post({ content, postId, isPostDelete }){
    const { setRefresh, navBack, setInPost, delPost, curMarker } = useContext(PostContext);
    // const storage = getStorage();
    const [text, setText] = useState(content.postDisc);
    const [editing, setEditing] = useState(false);
    
    useEffect(() => {
        setInPost(true);
    }, []);

    function handleExit(){
        setInPost(false);
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
                <button onClick={() => setEditing(true)}>edit</button>
            </div>
            </div>
    
    </div>
    </div>
    </>
    );
}