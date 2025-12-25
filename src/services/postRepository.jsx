
import { useRef, useEffect, useState } from 'react'
import { getFirestore, doc, setDoc, getDocs, getDoc, collection, addDoc, query } from "firebase/firestore";
import { auth, Firestore } from "../firebase.js"
import "../App.css";
import Post from "../components/Post.jsx"
// import { dirNavigate } from "../components/Map.jsx";

import { setAllMyPosts, allMyPosts } from "./globals.js";

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

export async function updatePosts(coords, url, setInPost){

    
    // const [allPosts, setPosts] = useState([]);
    // const [inPost, setInPost] = useState(false);
    
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

          const newPosts = allMyPosts;

          async function handlePostDelete(){
            //remove from firestore, mapbox, array
            // console.log("delete post");
            }
          //docSnap.data().url

          //PUT THIS IN APP.JS
          newPosts.push(<Route key={url} path={`/${url}`} element={<Post content={docSnap.data()} isPost={setInPost} postId={doc.id} isPostDelete={handlePostDelete}/>} />);
          
          //setPosts(newArr);
          //allMyPosts = newArr;
          setAllMyPosts(newPosts);
    }

    // export async function handlePostDelete(){
    //   //remove from firestore, mapbox, array
    //   // console.log("delete post");
    // }

    export async function setPostRefresh(setInPost){
        //populate array with routes
        const genSnapshot = await getDocs(collection(Firestore, "posts"));
        //console.log("snapshot: ", genSnapshot);

        async function handlePostDelete(){
            //remove from firestore, mapbox, array
            // console.log("delete post");

        }
        const newPosts = [];
        
        genSnapshot.forEach((doc) => {
            const data = doc.data();
            // console.log("doc url: "+ doc.url);
            newPosts.push(<Route key={data.url} path={`/${data.url}`} element={<Post content={data} isPost={setInPost} postId={doc.id} isPostDelete={handlePostDelete}/>} />);
        });
        // setPosts(newPosts);

        setAllMyPosts(newPosts);
    }

    export async function setPostMarkerRefresh(mapRef, navTo){
       
        const querySnapshot = await getDocs(collection(Firestore, "posts"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();

        //   async function handlePostClick(url){ 
        //     console.log(" navigate ");
        //     navigate("/" + url);
        //     }
          
          const Marker = new mapboxgl.Marker().setLngLat([data.Longitude, data.Latitude])
          
          Marker.getElement().addEventListener("click", ()=> {
          // console.log("in first use effect again");
          //handlePostClick(data.url);
          navTo(data.url);
          });

          Marker.getElement().classList.add("post-pin");
          Marker.addTo(mapRef.current);
      });
    }

    export function buildRoutes(inPost){
        return(
    <div className="overlay-post" style={{ pointerEvents: inPost ? "auto" : "none" }}>
        <Routes>
            {console.log("post")}
          {
          allMyPosts.map( Post => (
            console.log("post: path", Post.key),
            Post
          ))
          }
        </Routes>
    </div>
        )
    }