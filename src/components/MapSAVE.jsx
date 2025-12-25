import { useRef, useEffect, useState } from "react";
import { auth, Firestore } from "../firebase.js";
import mapboxgl from 'mapbox-gl'

//map save before creating posts

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

export default function Map({}) {

    const [curCanPost, setCurCanPost] = useState(false);
    const [inPost, setInPost] = useState(false);
    const [allPosts, setPosts] = useState([]);

    const mapRef = useRef(null);

    useEffect(() => {
    if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN){
        console.error('mapbox access token is not defined');
        return;
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/chrisrudzki/cmg6z3e6a00ew01rjdn9u35kw',
      center: [-74.5, 40],
      zoom: 9,
    });

    mapRef.current.setCenter([-123.312310125458, 48.464145303790666]);
    mapRef.current.setZoom(13.5);
     }, []);

    // create new post
    useEffect(() => {
    if (!mapRef.current) return;

    const handleMapClick = async (e) => {
    const coords = e.lngLat;
    if (curCanPost) {
      
      console.log("POSTED! Longitude:", coords.lng, "Latitude:", coords.lat);

      try {
            docRef = await addDoc(collection(Firestore, "posts"), {
            Longitude : coords.lng,
            Latitude: coords.lat,
            postUser: auth.currentUser.uid,
            postDisc: "caption",
            photos: []
          });

            // console.log("Document written ");
          } catch (e) {
            console.error("Error adding document: ", e);
          }

          console.log("created post: ", docRef.id);
          
          const docSnap = await getDoc(docRef);

          const newArr = allPosts;
          //docSnap.data().url
          newArr.push(<Route key={docRef.id} path={`/${docRef.id}`} element={<Post content={docSnap.data()} postId={docRef.id} isPost={setInPost} isPostDelete={handlePostDelete}/>} />);

          setPosts(newArr);
          
    
      const Marker = new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]);


      Marker.getElement().addEventListener("click", ()=> {
        setCurCanPost(false);
        if(docRef){
          // console.log("doc ref:" + docRef);
        handlePostClick(docRef);
        }

      });

      Marker.getElement().classList.add("post-pin");

      Marker.addTo(mapRef.current);

      }
    }
  
    mapRef.current.on('click', handleMapClick);

    return () => {
        mapRef.current.off('click', handleMapClick);
    };

    }, [curCanPost]);


    const logout = async () => {
      // console.log("logged out");
      await signOut(auth);
    }

    const handlePostButton = () => {
      setCurCanPost(prev => !prev);
      console.log(curCanPost);
    }


    return (
    <>
    
        <div class="overlay-map" style={{ pointerEvents: "none" }}>
        
        <button onClick={logout}style={{ pointerEvents: "auto" }}>log out</button>
        {/* <button onClick={tester} style={{ pointerEvents: "auto" }}> submit</button>
         */}

        <div class="right-side-bar">
        
        <button onClick={handlePostButton} style={{ pointerEvents: "auto", backgroundColor: curCanPost ? "red" : "unset" }}>post</button>

        <button style={{ pointerEvents: "auto" }}>profile</button>
        <button style={{ pointerEvents: "auto" }}>friennds</button>

        {/* HOW DO ROUTES WORK?? */}
 
        </div>
        </div>

        {/* whats going on here exactly? */}


        <div className="overlay-post" style={{ pointerEvents: inPost ? "auto" : "none" }}>
        <Routes>
    
          {
          allPosts.map( Post => (
            Post
          ))
          }
          
        </Routes>
        </div>

        <div id="map" style={{ width: '100vw', height: '100vh' }}></div>

        {/* <div id="map"></div> */}

        </>

        );
    }