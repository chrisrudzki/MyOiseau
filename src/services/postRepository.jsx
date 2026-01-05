
import { useRef, useEffect, useState } from 'react'
import { getFirestore, doc as docFunc, setDoc, getDocs, getDoc, collection, addDoc, query, deleteDoc } from "firebase/firestore";
import { auth, Firestore } from "../firebase.js"
import "../App.css";
import Post from "../components/Post.jsx"
// import { dirNavigate } from "../components/Map.jsx";

// import { setAllMyPosts, allMyPosts } from "./globals.js";

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

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
            // console.log("Document written ");
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
          //docSnap.data().url

          //PUT THIS IN APP.JS
          newPosts.push(<Route key={url} path={`/${url}`} element={<Post content={docSnap.data()} postId={docSnap.id} isPostDelete={handlePostDelete}/>} />);
          
          //setPosts(newArr);
          //allMyPosts = newArr;
          return newPosts;
    }

    // export async function handlePostDelete(){
    //   //remove from firestore, mapbox, array
    //   // console.log("delete post");
    // }

    export async function setPostRefresh(){
        //populate array with routes
        const genSnapshot = await getDocs(collection(Firestore, "posts"));
        //console.log("snapshot: ", genSnapshot);

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

    export async function setPostMarkerRefresh(mapRef, navTo, setCurMarker){
       
        const querySnapshot = await getDocs(collection(Firestore, "posts"));
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          
          const Marker = new mapboxgl.Marker().setLngLat([data.Longitude, data.Latitude])
          
          Marker.getElement().addEventListener("click", ()=> {
          // console.log("in first use effect again");
          //handlePostClick(data.url);
          setCurMarker(Marker);
          navTo(data.url);
          });

          Marker.getElement().classList.add("post-pin");
          Marker.addTo(mapRef.current);
      });
    }


    export async function doDelPost(url){

        const genSnapshot = await getDocs(collection(Firestore, "posts"));
        //console.log("snapshot: ", genSnapshot);

        async function handlePostDelete(){
            //remove from firestore, mapbox, array
            // console.log("delete post");
        }
        console.log("hit doc");

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
            // console.log("doc");

            // const postRef = doc(Firestore, "posts", doc.id);
            // deleteDoc(postRef);
        });

         console.log("hit doc2");


        return newPosts;

    }


    export function buildRoutes(inPost, allPosts){
      return allPosts;
    //     return(
    //       allPosts
    // <div className="overlay-post" style={{ pointerEvents: inPost ? "auto" : "none" }}>
    //    <Routes>
    //         {/* {console.log("post")} */}
    //       {
    //       allPosts.map( Post => (
    //         // console.log("post: path", Post.key),
    //         Post
    //       ))
    //       }
    //     </Routes>
    // </div>
    //     )
    }