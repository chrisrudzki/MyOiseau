import '../index.css'
import { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Link, useParams } from 'react-router-dom';
import { PostContext } from '../services/PostContext.js';
import { findUser, putUserFriendRequest, getFriends, getFriendRequests, addFriends } from '../services/postRepository.jsx';

export default function Friends({}){
    const { setRefresh, navBack, setInPopUp, delPost, curMarker, setShowFriends, myUserId } = useContext(PostContext);

    const [username, setUsername] = useState('');
    const [showFriendRequestBox, setShowFriendRequestBox] = useState(false);
    const [userId, setUserId] = useState(null);
    const [allFriends, setFriends] = useState([]);
    const [allFriendReqs, setFriendReqs] = useState([]);
    const [refresh, isRefresh] = useState(0);
    
    useEffect(() => {
        setInPopUp(true);
    }, []);

    useEffect(() => {
        //
    }, [isRefresh]);

    useEffect(() => {

        async function updateFriends(){
            console.log("test here !!", myUserId);
            const friends = await getFriends(myUserId);
            setFriends(friends);
            
        }

        updateFriends();

    }, [refresh]);

    useEffect(() => {

        async function updateFriendRequests(){
            const friendReqs = await getFriendRequests(myUserId);
            setFriendReqs(friendReqs);
            console.log("friend reqs", friendReqs);
            
            
        }

        updateFriendRequests();

    }, [refresh]);

    function handleExit(){
        setInPopUp(false);
        setShowFriends(false);
    }

    function handleExitFriendReq(){
        setShowFriendRequestBox(false);
    }

    function searchUser(){

        async function innerSearchUser(){
        //go though users and search
        console.log("username", username);
        const user = await findUser(username);//output collection id insted
        setUserId(user);

        if(user){
            setShowFriendRequestBox(true);

        }
        // if (userId == null){

        // }else{
        //     setShowFriendRequestBox(true);
        //     console.log("yoopp!!");
        //     console.log("user id", userId);
        // putUserFriendRequest(myUserId, userId);//put current user id inside user friend requests
        // }

        //myUserId

        console.log("yoo!!");

        }

        innerSearchUser();
        //go through users 

        // if user matches username, do pop up, output in pop up

    }

    function handleSendFriendRequest(){
        async function innerSendFriendRequest(){
            if (userId == null){
                console.log("error sending friend request");
                return;

            }else{
                console.log("my user id: ", myUserId);
                putUserFriendRequest(myUserId, userId);//put current user id inside user friend requests
            }
            setTimeout(() => {
            setShowFriendRequestBox(false);
            }, 300);
        }

        innerSendFriendRequest()
    }

    async function handleAddFriend(addedDocID){
        console.log("add friend", addedDocID);

        await addFriends(myUserId, addedDocID);
        isRefresh(r => r + 1);
        console.log("yo!!just refrehsed ");
        //call post repo to add this user to current friend list
    }

    return(
    <>
    <div className="post-outer-box">
    <div className="post-box">

         <input
        
        placeholder=""
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />

        {showFriendRequestBox ? (
        <div className="friendReq-outer-box">
        <div className="friendReq-box">
        <button onClick={() => { handleExitFriendReq(); }} style={{ pointerEvenets:"auto" }}>X</button>
        
        {username}

        <button onClick={() => { handleSendFriendRequest(); }} style={{ pointerEvenets:"auto" }}>Send Friend Request</button>
        

        </div>
        </div>
        ) : (
        <></>
        )}

        <button 
        style={{
        width: "100%",
        marginTop: "20px"
        }}
        class="log-screen-button"
        onClick={() => {searchUser();}}>Search</button>

    <button onClick={() => { handleExit(); setRefresh(r => r + 1); }} style={{ pointerEvenets:"auto" }}>X</button>
         <p>Friend requests </p>
        {
             
           <ul>
           
        
            {/* //CONSTRUCT LISTS USING data using data.id and data username
            //for friend requests 
            
            // do the same for friends but friends has a diffrent onClick handler */}

            {allFriendReqs ? (
       allFriendReqs.map(FriendReqs => (
             <li key={FriendReqs.userId} >
             <span>{FriendReqs.username}</span>

             <button onClick={() => handleAddFriend(FriendReqs.userId)}>
                 Add Friend
             </button>
             </li>
        ))
      ) : (
        <></>
      )}

      

        {/* //  allFriendReqs.map(FriendReqs => (
        //      <li key={FriendReqs.userId} >
        //      <span>{FriendReqs.username}</span>

        //      <button onClick={() => handleAddFriend(FriendReqs.userId)}>
        //          Add Friend
        //      </button>
        //      </li>
        // )) */}
        
        </ul>
          }

          <p>Friends </p>


          {allFriends ? (
       allFriends.map(Friends => (
             <li key={Friends.userId} >
             <span>{Friends.username}</span>

             
             </li>
        ))
      ) : (
        <></>
      )}

    </div>
    </div>
    </>
    );
}