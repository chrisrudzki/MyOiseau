import { getFirestore, doc as docFunc, getDocs, getDoc, collection, addDoc, deleteDoc, arrayUnion, updateDoc, query, where, arrayRemove } from "firebase/firestore";
import { auth, Firestore } from "../firebase.js"
import "../App.css";
import Post from "../components/Post.jsx"
import React, { useEffect, useContext, useState } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';


import { PostContext } from './PostContext.js';




// update posts in firestore
export async function updatePosts(coords, url, allPosts){
    
    
    console.log("POSTED! Longitude:", coords.lng, "Latitude:", coords.lat);

      let docRef = null;

      try {
            docRef = await addDoc(collection(Firestore, "posts"), {
            Longitude : coords.lng,
            Latitude: coords.lat,
            postUser: auth.currentUser.uid,
            postDisc: "caption",
            url: url,
            photos: []
          });
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          console.log("created post: url", url);
          
          const docSnap = await getDoc(docRef);

          const newPosts = allPosts;

          async function handlePostDelete(){
            //remove from firestore, mapbox, array
            // console.log("delete post");
            }

          newPosts.push(<Route key={url} path={`/${url}`} element={<Post content={docSnap.data()} postId={docSnap.id} isPostDelete={handlePostDelete}/>} />);
          
          return newPosts;
    }

    // send updated post array
    export async function setPostRefresh(){
        const genSnapshot = await getDocs(collection(Firestore, "posts"));
        
        async function handlePostDelete(){
            //remove from firestore, mapbox, array
            // console.log("delete post");
        }
        const newPosts = [];
        
        genSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            newPosts.push(<Route key={data.url} path={`/${data.url}`} element={<Post content={data} postId={docSnap.id} isPostDelete={handlePostDelete}/>} />);
        });
        return newPosts;
    }

    // update markers on map



    //check current user id and current user friends through doc id
    export async function setPostMarkerRefresh(mapRef, navTo, setCurMarker, userUID){
        
        //make potential users

        console.log("test9090: ", userUID);//userId

        let userId_active = [];

        userId_active[0] = userUID;

        const q = query(collection(Firestore, "users"), where("userId", "==", userUID));

        const snapshot = await getDocs(q);
        
        for (const document of snapshot.docs) {
            const friends_arr = document.data().friends ?? [];

        for (const friend of friends_arr) {
            const docRef = docFunc(Firestore, "users", friend.userId);
            const snap = await getDoc(docRef);

        if (snap.exists()) {
            userId_active.push(snap.data().userId);
        }

        }
        }

        console.log("my array:", userId_active);
        console.log("lenfth", userId_active.length);

        const querySnapshot = await getDocs(collection(Firestore, "posts"));

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          
          console.log("post user:", data.postUser);
          console.log("len", userId_active.length);

          
          for(let i = 0;i < userId_active.length ;i++){//go through all potential users #
            console.log("m");
            if(userId_active[i] == data.postUser){//check if the post matches pot user
          
          const Marker = new mapboxgl.Marker().setLngLat([data.Longitude, data.Latitude])
          
          Marker.getElement().addEventListener("click", ()=> {
          setCurMarker(Marker);
          navTo(data.url);
          });

          Marker.getElement().classList.add("post-pin");
          Marker.addTo(mapRef.current);
        
        }// if
        }// for

      });
    }

    // delete post by updating post array
    export async function doDelPost(url){
        const genSnapshot = await getDocs(collection(Firestore, "posts"));
        
        async function handlePostDelete(){
            //remove from firestore, mapbox, array
             console.log("delete post form here");
        }
        
        const newPosts = [];
        
        genSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.url != url){
            newPosts.push(<Route key={data.url} path={`/${data.url}`} element={<Post content={data} postId={docSnap.id} isPostDelete={handlePostDelete}/>} />);
            } else {  
                const postRef = docFunc(Firestore, "posts", docSnap.id);
                deleteDoc(postRef);

                console.log("dont add");
            }
           
        });

        return newPosts;
    }


    // return current posts 
    export function buildRoutes(inPost, allPosts){
        return allPosts;
  
    }



    //update users, create new user
    export async function storeNewUser(email, url, username){

        let docRef = null;

        console.log("here yo");

        try {
        docRef = await addDoc(collection(Firestore, "users"), {
            userEmail : email,
            userUsername: username,
            profilePageUrl: url,
            userId: auth.currentUser.uid,
          });
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }


    export async function getUserUrl(uId){
        const genSnapshot = await getDocs(collection(Firestore, "users"));

        let profPageUrl = null;
        
        genSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            console.log("here rep ");
            if (data.userId == uId){
                console.log("here 5", data.userId);
                console.log("returning url: ", data.profilePageUrl);
                profPageUrl = data.profilePageUrl;
            }
        });

        return profPageUrl;
        // console.log("profile not found", data.userId);
        // return null;
    }

    export async function getUserData(url){
        const genSnapshot = await getDocs(collection(Firestore, "users"));

        let username = null;
        
        genSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            console.log("here rep ");
            if (data.profilePageUrl == url){
                console.log("here 5", data.userUsername);
                console.log("returning username: ", data.userUsername);
                username = data.userUsername;
            }
        });

        return username;
        // console.log("profile not found", data.userId);
        // return null;
    }

    export async function findUser(username){
        const genSnapshot = await getDocs(collection(Firestore, "users"));

        let docId = null;
        
        console.log("username", username);

        genSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            console.log("here rep ");

            if (data.userUsername == username){
                
                console.log("returning username: ", data.userUsername);
                docId = docSnap.id;
                // userId = data.userId;
            }
        });

        return docId;

    }

    export async function putUserFriendRequest(myUserId, userId){
        // const genSnapshot = await getDocs(collection(Firestore, "users"));

        //curUserId
        // let userId = null;
    //    const userRef = doc(Firestore, "users", userId);

    //     await updateDoc(userRef, {
    //         friends: arrayUnion(myUserId)
    //     });  myUserId

        const genSnapshot = await getDocs(collection(Firestore, "users"));

        let username = null;
        let data = null;
        let userColId = null;
        
        genSnapshot.forEach((docSnap) => {
            data = docSnap.data();
            
            if (data.userId == myUserId){
                userColId = docSnap.id;
                console.log("col id: ", userColId);
                username = data.userUsername;
            }
        });

        console.log("user:", username, "id", userColId);

        const userRef = docFunc(Firestore, "users", userId);
        
        await updateDoc(userRef, {
            friendRequests: arrayUnion({ userId: userColId, username: username})
        });
    }


    export async function getFriends(myUserId){
        const genSnapshot = await getDocs(collection(Firestore, "users"));
        
        // async function handlePostDelete(){
        //     console.log("delete post");
        // }
        // const newFriends = [];
        
        // genSnapshot.forEach((docSnap) => {
        //     const data = docSnap.data();
        //     newFriends.push(data);
        // });
        // return newFriends;


        let newFriends = [];
        
        genSnapshot.forEach((docSnap) => {

            const data = docSnap.data();

            if(data.userId == myUserId){
                newFriends = data.friends;
                console.log("friend:", data.friends);
            }
            
        });

        return newFriends;

    }

    export async function getFriendRequests(myUserId){
        const genSnapshot = await getDocs(collection(Firestore, "users"));
        
        let newFriendReqs = [];
        
        genSnapshot.forEach((docSnap) => {

            const data = docSnap.data();

            if(data.userId == myUserId){
                newFriendReqs = data.friendRequests;
                console.log("friend:", data.friendRequests);
            }
            
        });
        return newFriendReqs;
    }

    export async function addFriends(curUserUID, friendDocID){
        
        // search by userId value in firestore
        console.log(curUserUID," : ", friendDocID);


        let friendUsername = null;
        // let data = null;
        let friendUID = null;
        let userDocId = null;
        let userUsername = null;

        const docRef = docFunc(Firestore, "users", friendDocID);
        const snap = await getDoc(docRef);

        //STORE FRIEND INFO
        if (snap.exists()) {
            //console.log(snap.id, snap.data().userUsername);
            //console.log("friend: ", snap.userUsername);
            
            friendUID = snap.data().userId;
            friendUsername = snap.data().userUsername;

            console.log("test ", snap.data().userId);
            console.log("test2 ", snap.data().userUsername);//working!!
        }
        
        //STORE DATA IN USER FRIENDS 
        console.log("user uid:", curUserUID);

        const q = query(collection(Firestore, "users"), where("userId", "==", curUserUID));

        const snapshot = await getDocs(q);
        console.log("ss ", friendUID, friendUsername);
    

        for (const document of snapshot.docs) {
            //const friends_arr = document.data();
            userDocId = document.id;
            userUsername = document.data().userUsername;

            console.log("user doc id: ", userDocId);
            console.log("user username: ", userUsername);//working!!

            await updateDoc(
                docFunc(Firestore, "users", document.id),
                {
            friends: arrayUnion({
            userId: friendDocID,
            username: friendUsername
            }),
            friendRequests: arrayRemove({
            userId: friendDocID,
            username: friendUsername
            })
            }
        );
        }

        //OLD
        // snapshot.forEach(async (document) => {
        //     userDocId = document.id;
        //     userUsername = document.userUsername;
        //     await updateDoc(docFunc(Firestore, "users", document.id), {

        //     friends: arrayUnion({ userId: friendDocID, username: friendUsername}),//putting in the friend into my friends
        //     friendRequests: arrayRemove({userId : friendDocID, username: friendUsername})
            
        // });
        //     // console.log("friend username: ", document.userUsername);
        // });
        //OLD

        console.log("friend doc id: ", friendDocID);
        console.log("user doc id: ", userDocId);
        console.log("username : ", userUsername);

        //STORE USER DATA IN FRIEND
        
        const docRef2 = docFunc(Firestore, "users", friendDocID);
        
        await updateDoc(docRef2, {
        friends: arrayUnion({ userId: userDocId, username: userUsername })
        });

        // const p = query(collection(Firestore, "users"), where("userId", "==", userUID));

        // const snapshot2 = await getDocs(p);
        
        // for (const document of snapshot.docs) {
        //     const friends_arr = document.data().friends ?? [];

        // for (const friend of friends_arr) {
        //     const docRef = docFunc(Firestore, "users", friend.userId);
        //     const snap = await getDoc(docRef);

        // if (snap.exists()) {
        //     userId_active.push(snap.data().userId);
        // }

        // }
        // }


    }


    export async function getPostUser(postId){

        const docRef = docFunc(Firestore, "posts", postId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
            
            return snap.data().postUser;
        }

    }



    

    //  export async function getUserInfo(uId){

    //     const genSnapshot = await getDocs(collection(Firestore, "users"));
        
    //     genSnapshot.forEach((docSnap) => {
    //         const data = docSnap.data();
    //         if (data.userId == uId){
    //             return data.url;
    //             //return all relevenet info for profile
    //         }
    //     });

    // }