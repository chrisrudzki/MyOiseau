import '../index.css'
import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Link, useParams } from 'react-router-dom';
import { PostContext } from '../services/PostContext.js';
import { getUserData } from '../services/postRepository.jsx';

export default function UserProfile(){
    const { setRefresh, navBack, setInPopUp, delPost, curMarker } = useContext(PostContext);
    const [curUsername, setCurUsername] = useState(null);

    const { curUserUrl } = useParams();
    
    useEffect(() => {
        console.log("post url ", curUserUrl);
        setInPopUp(true);
    }, []);

    useEffect(() => {
        async function setUserData(){
        let username = await getUserData(curUserUrl);
        setCurUsername(username);
        }
        setUserData();
    }, []);
    
    function handleExit(){
        setInPopUp(false);
    }

return(
    <>
    <div className="post-outer-box">
    <div className="post-box">

    
         <Link to="/" >
            <button onClick={() => { handleExit(); setRefresh(r => r + 1); }} style={{ pointerEvenets:"auto", marginLeft: "90%" }}>X</button>
         </Link>

            <div class="post-inner-box-config">
            <div class="post-inner-box">

            

            <div style={{ fontSize: "25px", marginTop: "50px" }}>{"Username: " + curUsername}</div>
                
            </div>
            </div>
    
    </div>
    </div>
    </>
);

}