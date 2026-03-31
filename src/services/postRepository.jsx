import { getFirestore, doc as docFunc, getDocs, getDoc, collection, addDoc, deleteDoc, arrayUnion, updateDoc, query, where, arrayRemove, increment, writeBatch } from "firebase/firestore";
import { auth, Firestore } from "../firebase.js"
import "../App.css";
import Post from "../components/Post.jsx"
import React, { useEffect, useContext, useState } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { PostContext } from './PostContext.js';

let activeMarkers = [];

// add a post to firestore
export async function updatePosts(coords, url, allPosts){
    console.log("POSTED! Longitude:", coords.lng, "Latitude:", coords.lat);
      let docRef = null;

      //get number of
      try {
            docRef = await addDoc(collection(Firestore, "posts"), {
            Longitude : coords.lng,
            Latitude: coords.lat,
            postUser: auth.currentUser.uid,
            postDisc: " ",
            url: url,
            radius: 100,
            mood: "None",
            moodLvl: 0,
            color: "None",
            posted_date: Date.now(),
            boosted_days: 0,
            has_exit: false

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


    export async function setPostHasExit(postId){

        const docRef = docFunc(Firestore, "posts", postId);

        await updateDoc(docRef, {
            has_exit: true
        });


    }

    export async function getPostHasExit(postId) {
    const docRef = docFunc(Firestore, "posts", postId);
    const docSnap = await getDoc(docRef);

    // if (!docSnap.exists()) {
    //     console.log("No post found with id:", postId);
    //     return null;
    // }

    console.log("has exit ", docSnap.data().has_exit);

    return docSnap.data().has_exit;
}




    //needs change I think
    // export async function decreasePostRadius(postId){

    //     const docRef = docFunc(Firestore, "posts", postId);

    //     await updateDoc(docRef, {
    //         radius: increment(-1.2)
    //     });

    //     const snap = await getDoc(docRef);
    //     const radius = snap.data().radius;

    //     if(radius < 10){
    //         return true;

    //     }else{
    //         return false;
    //     }


    // }

    // export async function getPostUser(postId){

    //     const docRef = docFunc(Firestore, "posts", postId);
    //     const snap = await getDoc(docRef);

    //     if (snap.exists()) {
            
    //         return snap.data().postUser;
    //     }

    // }



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

    // export async function setPostRefresh(myUserId){
    // const genSnapshot = await getDocs(collection(Firestore, "posts"));
    
    // // get user's friends first
    // const q = query(collection(Firestore, "users"), where("userId", "==", myUserId));
    // const snapshot = await getDocs(q);
    
    // let userId_active = [myUserId];
    // for (const document of snapshot.docs) {
    //     const friends_arr = document.data().friends ?? [];
    //     for (const friend of friends_arr) {
    //         userId_active.push(friend.userId);
    //     }
    // }

    // const newPosts = [];
    // genSnapshot.forEach((docSnap) => {
    //     const data = docSnap.data();
    //     if (userId_active.includes(data.postUser)) { // ← filter here
    //         newPosts.push(<Route key={data.url} path={`/${data.url}`} element={<Post content={data} postId={docSnap.id} isPostDelete={handlePostDelete}/>} />);
    //     }
    // });
    // return newPosts;
    // }

    export async function boostSimilarPosts(postId, moodLvl, mood, myUserId){

        // const docRef = docFunc(Firestore, "posts", postId);

        // await updateDoc(docRef, {
        //     has_exit: true
        // });

        console.log("in exit: ", mood," ",  moodLvl," ",  myUserId, " ", postId);


        const q = query(
        collection(Firestore, "posts"),
        where("mood", "==", mood),
        where("postUser", "==", myUserId)
        );

        const snapshot = await getDocs(q);

        // Use a batch for atomic, efficient updates
        const batch = writeBatch(Firestore);

        snapshot.forEach((docSnap) => {
        if(docSnap.id === postId) return;

        console.log("match");

        const ref = docFunc(Firestore, "posts", docSnap.id);
        batch.update(ref, {
            boosted_days: increment(3 * moodLvl)  // ← your new mood value
        });
        });

        await batch.commit();

    }

    export async function countSimilarPosts(postId, mood, myUserId){
        // const [simPostNum , setPostNum] = useState(0);
        let simPostNum = 0;

        console.log("in exit: ", mood," ",  myUserId);

        const q = query(
        collection(Firestore, "posts"),
        where("mood", "==", mood),
        where("postUser", "==", myUserId)
        );

        const snapshot = await getDocs(q);

        // Use a batch for atomic, efficient updates
        // const batch = writeBatch(Firestore);

        snapshot.forEach((docSnap) => {
        
        //
            simPostNum = simPostNum + 1;

        });

        const ref = docFunc(Firestore, "posts", postId);
        await updateDoc(ref, {
            boosted_days: simPostNum * 3
        });

        // return simPostNum;

    }




    // update markers on map

    //check current user id and current user friends through doc id
    export async function setPostMarkerRefresh(mapRef, navTo, setCurMarker, userUID){
        // make potential users
        // console.log("test9090: ", userUID);//userId

        console.log("setPostMarker Func");

        let userId_active = [];//user and friends

        userId_active[0] = userUID;

        //get current user
        const q = query(collection(Firestore, "users"), where("userId", "==", userUID));

        const snapshot = await getDocs(q);
        
        //store user and user friends 
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
        
        const querySnapshot = await getDocs(collection(Firestore, "posts"));

        //clear old markers
        activeMarkers.forEach(m => m.remove());
        activeMarkers = [];

        const moodGroups = {};

        //go through all posts
        querySnapshot.forEach((docSnap) => {
          
          const data = docSnap.data();
          //   console.log("post user:", data.postUser);
          //   console.log("len", userId_active.length);
          for(let i = 0;i < userId_active.length ;i++){//go through all potential users #
            // console.log("m");
            if(userId_active[i] == data.postUser){//check if the post matches pot user
            const mood = data.mood;

            const key = `${mood}_${data.postUser}`; // e.g. "happy_abc123"

            if (!moodGroups[key]) {
                moodGroups[key] = [];
            }

            moodGroups[key].push([data.Longitude, data.Latitude]);
            
            //addSource
          
            //create inner post marker
            // console.log("CREATE ELEMENT");
            const ele = document.createElement('div');
            ele.style.cssText = `
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #7c83fd;
            border: 3px solid white;
            box-sizing: border-box;
            cursor: pointer;
            `;

            if (!document.getElementById('pulse-style')) {
            const style = document.createElement('style');
            style.id = 'pulse-style';
            style.textContent = `
            @keyframes pulse-ring {
            0%   { transform: scale(.5); opacity: .8; }
            100% { transform: scale(2); opacity: 0; }
            }
            `;
            document.head.appendChild(style);
            }

            const Marker = new mapboxgl.Marker({ element: ele }).setLngLat([data.Longitude, data.Latitude])

            // const Marker = new mapboxgl.Marker({ element: ele, anchor: 'center' }).setLngLat([data.Longitude, data.Latitude])
            // const Marker = new mapboxgl.Marker().setLngLat([data.Longitude, data.Latitude]);

          Marker.getElement().addEventListener("click", ()=> {
          setCurMarker(Marker);
          navTo(data.url);
          });
          
          Marker.getElement().classList.add("post-pin");
          Marker.addTo(mapRef.current);
          activeMarkers.push(Marker);

        }// if
        }// for
      });

      // Build a GeoJSON feature for each mood group
    const lineFeatures = Object.entries(moodGroups)
    .filter(([mood, coords]) => coords.length > 1) // need at least 2 points for a line
    .map(([mood, coords]) => ({
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: coords
        },
        properties: { mood }
    }));



    //TESTING GETTING RID OF THIS 
    // Add or update the lines source
//     if (!mapRef.current.getSource('mood-lines')) {
//     mapRef.current.addSource('mood-lines', {
//         type: 'geojson',
//         data: { type: 'FeatureCollection', features: lineFeatures }
//     });

//     mapRef.current.addLayer({
//         id: 'mood-lines',
//         type: 'line',
//         source: 'mood-lines',
//         paint: {
//             'line-width': 7,
//             'line-dasharray': [2, 1],
//             'line-opacity': 0.3,
//             'line-color': [
//                 'match', ['get', 'mood'],
//                 'happy',  '#FFD700',
//                 'sad',    '#6495ED',
//                 'angry',  '#FF4500',
//                 /* default */ '#7c83fd'
//             ]
//         }
//     });


// } else {
//     // Already exists, just update data
//     mapRef.current.getSource('mood-lines').setData({
//         type: 'FeatureCollection',
//         features: lineFeatures
//     });
// }

//til here - test


      // in setPostMarkerRefresh, replace your addSource/addLayer with this:



      //TEST MAR 31 ALL BELOW 

// if (!mapRef.current.getSource('posts')) {
//   mapRef.current.addSource('posts', {
//     type: 'geojson',
//     data: {
//       type: 'FeatureCollection',
//       features: querySnapshot.docs.filter(p => userId_active.includes(p.data().postUser)).map(p => ({
//         type: 'Feature',
//         geometry: { type: 'Point', coordinates: [p.data().Longitude, p.data().Latitude] },
//         properties: { radius: p.data().radius }
//       }))
//     }//data
//   });

//     mapRef.current.addLayer({
//   id: 'post-circles',
//   type: 'circle',
//   source: 'posts',
//   paint: {
//     'circle-radius': [
//       'interpolate', ['exponential', 2], ['zoom'],
//       1,  ['/', ['get', 'radius'], 100],   // zoom 1:  radius / 100
//       15, ['*', ['get', 'radius'], 1.5],   // zoom 15: radius * 1.5
//       20, ['*', ['get', 'radius'], 5],     // zoom 20: radius * 5
//     ],
//     'circle-opacity': 0.5, 
//     'circle-pitch-alignment': 'map', // sticks to map not screen
//     'circle-color': ['coalesce', ['get', 'color'], '#7c83fd']
//   }//paint
// });

//     } else {

//         const now = new Date();
//         // source already exists, just update the data
//         mapRef.current.getSource('posts').setData({
//         type: 'FeatureCollection',
//         features: querySnapshot.docs.filter(p => userId_active.includes(p.data().postUser)).map(p => {
        
//         let radius = 100;

//         if(p.data().has_exit == true){
        
//             const data = p.data();
//             radius = 1 - (now.getTime() - data.posted_date) / ((data.moodLvl * 3) * (1000 * 60 * 20) + data.boosted_days * (1000 * 60 * 20)); // 1000 * 60 * 60 * 24 to include hours
//             radius = radius * 100;
        
//             if(radius < 20){
//                 radius = 20
//             }

//         }else{
//             radius = p.data().radius;
//         }

//         return {    
//         type: 'Feature',
//         geometry: { type: 'Point', coordinates: [p.data().Longitude, p.data().Latitude] },
//         properties: { radius: radius, color: p.data().color 
//         }


//     };
//     })
//   });
// }//else

}//setPostMarkerRefresh

export async function addPostGraphics(mapRef, userUID){
     
        let userId_active = [];//user and friends

        const moodGroups = {};


        // const mood = data.mood;

        // const key = `${mood}_${data.postUser}`; // e.g. "happy_abc123"

        userId_active[0] = userUID;

        //  if (!moodGroups[key]) {
        //         moodGroups[key] = [];
        // }

        // moodGroups[key].push([data.Longitude, data.Latitude]);
            

        //get current user
        const q = query(collection(Firestore, "users"), where("userId", "==", userUID));

        const snapshot = await getDocs(q);

        //store user and user friends 
        for (const document of snapshot.docs) {
            const friends_arr = document.data().friends ?? [];
        for (const friend of friends_arr) {
            const docRef = docFunc(Firestore, "users", friend.userId);
            const snap = await getDoc(docRef);
        if (snap.exists()) {
            userId_active.push(snap.data().userId);
        }
        }//for

        }//if

    const querySnapshot = await getDocs(collection(Firestore, "posts"));

    querySnapshot.forEach((docSnap) => {
          
          const data = docSnap.data();
          //   console.log("post user:", data.postUser);
          //   console.log("len", userId_active.length);
          for(let i = 0;i < userId_active.length ;i++){//go through all potential users #
            // console.log("m");
            if(userId_active[i] == data.postUser){//check if the post matches pot user
            const mood = data.mood;

            const key = `${mood}_${data.postUser}`; // e.g. "happy_abc123"

            if (!moodGroups[key]) {
                moodGroups[key] = [];
            }

            moodGroups[key].push([data.Longitude, data.Latitude]);

            }
        }
    });

    const lineFeatures = Object.entries(moodGroups)
    .filter(([mood, coords]) => coords.length > 1) // need at least 2 points for a line
    .map(([mood, coords]) => ({
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: coords
        },
        properties: { mood }
    }));

    
    // Add or update the lines source
    if (!mapRef.current.getSource('mood-lines')) {
    mapRef.current.addSource('mood-lines', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: lineFeatures }
    });

    mapRef.current.addLayer({
        id: 'mood-lines',
        type: 'line',
        source: 'mood-lines',
        paint: {
            'line-width': 7,
            'line-dasharray': [2, 1],
            'line-opacity': 0.3,
            'line-color': [
                'match', ['get', 'mood'],
                'happy',  '#FFD700',
                'sad',    '#6495ED',
                'angry',  '#FF4500',
                /* default */ '#7c83fd'
            ]
        }
    });


} else {
    // Already exists, just update data
    mapRef.current.getSource('mood-lines').setData({
        type: 'FeatureCollection',
        features: lineFeatures
    });
    }
        
//added here
    if(!mapRef.current.getSource('posts')) {
    mapRef.current.addSource('posts', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: querySnapshot.docs.filter(p => userId_active.includes(p.data().postUser)).map(p => ({
      //features: querySnapshot.docs.map(p => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.data().Longitude, p.data().Latitude] },
        properties: { radius: p.data().radius }
         }))
        }
    });

   mapRef.current.addLayer({
  id: 'post-circles',
  type: 'circle',
  source: 'posts',
  paint: {
    'circle-radius': [
      'interpolate', ['exponential', 2], ['zoom'],
      1,  ['/', ['get', 'radius'], 100],   // zoom 1:  radius / 100
        //       15, ['*', ['get', 'radius'], 1.5],   // zoom 15: radius * 1.5
        //       20, ['*', ['get', 'radius'], 5],     // zoom 20: radius * 5    
    ],
    'circle-opacity': 0.5, 
    'circle-pitch-alignment': 'map', // sticks to map not screen
    'circle-color': ['coalesce', ['get', 'color'], '#7c83fd']
  }
});
} else {
        const now = new Date();
        // source already exists, just update the data
        mapRef.current.getSource('posts').setData({
        type: 'FeatureCollection',
        features: querySnapshot.docs.filter(p => userId_active.includes(p.data().postUser)).map(p => {

        let radius = 100;
        
        if(p.data().has_exit == true){
            const data = p.data();
            radius = 1 - (now.getTime() - data.posted_date) / ((data.moodLvl * 3) * (1000 * 60 * 20) + data.boosted_days * (1000 * 60 * 20)); // 1000 * 60 * 60 * 24 to include hours
            radius = radius * 100;
            
            if(radius < 20){
                radius = 20
            }

        }else{
            radius = p.data().radius;
        }
        // console.log("post: ", p.data().postDisc, "rad: ", radius);

        return {    
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.data().Longitude, p.data().Latitude] },
        properties: { radius: radius, color: p.data().color 
        }


        };
    })
  });

}//else






//     } else {
//         // source already exists, just update the data
//         mapRef.current.getSource('posts').setData({
//         type: 'FeatureCollection',
//         features: querySnapshot.docs.map(p => ({
//         type: 'Feature',
//         geometry: { type: 'Point', coordinates: [p.data().Longitude, p.data().Latitude] },
//         properties: { radius: p.data().radius, color: p.data().color }
//     }))
//   });

// }
    }//addPostGraphics

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