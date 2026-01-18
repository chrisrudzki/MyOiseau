
import { getFirestore, doc as docFunc, getDocs, getDoc, collection, addDoc, deleteDoc } from "firebase/firestore";
import { auth, Firestore } from "../firebase.js"
import "../App.css";
import Post from "../components/Post.jsx"

import { BrowserRouter as Router, Route } from 'react-router-dom';

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
    export async function setPostMarkerRefresh(mapRef, navTo, setCurMarker){
        const querySnapshot = await getDocs(collection(Firestore, "posts"));
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          
          const Marker = new mapboxgl.Marker().setLngLat([data.Longitude, data.Latitude])
          
          Marker.getElement().addEventListener("click", ()=> {
          setCurMarker(Marker);
          navTo(data.url);
          });

          Marker.getElement().classList.add("post-pin");
          Marker.addTo(mapRef.current);
      });
    }

    // delete post by updating post array
    export async function doDelPost(url){
        const genSnapshot = await getDocs(collection(Firestore, "posts"));
        
        async function handlePostDelete(){
            //remove from firestore, mapbox, array
             console.log("delete post form here");
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
           
        });

        console.log("hit doc2");

        return newPosts;
    }


    // return current posts
    export function buildRoutes(inPost, allPosts){
      return allPosts;
  
    }