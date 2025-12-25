import { useRef, useEffect, useState } from "react";
import { auth, Firestore } from "../firebase.js";
import mapboxgl from 'mapbox-gl'
import { canPost, changeCanPost, getCanPost } from "../services/globals.js";
import '../index.css';


import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import { buildRoutes, setPostRefresh, updatePosts, setPostMarkerRefresh} from '../services/postRepository.jsx';

export default function Map({}) {
    const [curCanPost, setCurCanPost] = useState(false);
    const [inPost, setInPost] = useState(false);
    // const [allPosts, setPosts] = useState([]);

    const mapRef = useRef(null);
    // const myRef = useRef(null);

    const navigate = useNavigate();
    //setPostMarkerRefresh
    useEffect(() => {
    if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN){
        console.error('mapbox access token is not defined');
        return;
    }

    async function navTo(url){ 
      console.log(" navigate ");
      navigate("/" + url);     
    }
    
//f19f7888-c798-4a1a-993e-439506626a80


    //new post
    const handleMapClick = async (e) => {
      console.log("here2");
      const coords = e.lngLat;
      console.log("cp", getCanPost());
      if (getCanPost()) {
      //
      console.log("inside !", getCanPost());
      changeCanPost();
      setCurCanPost(false);
      
      //set is_post value 
      const url = crypto.randomUUID();

      updatePosts(coords, url, setInPost);// send data to firebase
      
      const Marker = new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]).addTo(mapRef.current);
      
      // console.log("lat", coords.lng, "long", coords.lat)
      Marker.getElement().addEventListener("click", ()=> {
        console.log("got to initalize");
        handlePostClick(url);
      });

      console.log("got here");

      try{
      Marker.getElement().classList.add("post-pin");
      }catch(d){
        console.log("yo!");
      }
      }
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

    // mapRef.current.on('load', () => {
    //   mapRef.current.on('click', handleMapClick);
    // });

      mapRef.current.on('click', handleMapClick);

      // mapRef.current.on('load', () => {

      //after mapRef is created dirNavigate
      setPostMarkerRefresh(mapRef, navTo);

     }, []);

    // create new post
    // useEffect(() => {
    // if (!mapRef.current) return;

    // const handleMapClick = async (e) => { setPostMarkerRefresh

    // console.log("here2");
    // const coords = e.lngLat;
    // if (curCanPost) {

    //   //set is_post value 
    //   const url = crypto.randomUUID();

    //   updatePosts(coords, url, setInPost);// send data to firebase

    //   const Marker = new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]);

    //   Marker.getElement().addEventListener("click", ()=> {

    //     setCurCanPost(false);
    //     if(url){
    //       // console.log("doc ref:" + docRef);
    //       handlePostClick(url);
    //     }
    //   });

    //   Marker.getElement().classList.add("post-pin");

    //   Marker.addTo(mapRef.current);

    //   }
    // }

    // console.log("here");
  
    // // mapRef.current.on('click', handleMapClick);

    // // return () => {
    // //     mapRef.current.off('click', handleMapClick);
    // // };

    // }, [curCanPost]);




    //make new post
    // useEffect(() => {
    //   if (!mapRef.current) return;

    //   const map = mapRef.current;

    //   const handleMapClick = (e) => {
    //     console.log("here2");

    //     const coords = e.lngLat;
        
    //     if (curCanPost) {
    //     //set is_post value 
    //     const url = crypto.randomUUID();

    //     updatePosts(coords, url, setInPost);// send data to firebase

    //     const Marker = new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]);

    //     Marker.getElement().addEventListener("click", ()=> {

    //     setCurCanPost(false);
    //     if(url){
    //       // console.log("doc ref:" + docRef);
    //       handlePostClick(url);
    //     }
    //   });

    //   Marker.getElement().classList.add("post-pin");

    //   Marker.addTo(mapRef.current);
    //   }

    //   };

    //   const onLoad = () => {
    //     map.on("click", handleMapClick);
    //   };

    //   map.on("load", onLoad);

    //   return () => {
    //     map.off("click", handleMapClick);
    //     map.off("load", onLoad);
    //   };
    // }, [curCanPost]);


    useEffect(() => {
      setPostRefresh(setInPost);

    }, []);

    // useEffect(() => {
    //   setPostMarkerRefresh(mapRef);

    // }, []); setPostMarkerRefresh

    const logout = async () => {
      // console.log("logged out");
      await signOut(auth);
    }

    const handlePostButton = () => {
      setCurCanPost(prev => !prev);
      changeCanPost();

    }

    async function handlePostClick(url){ 
      console.log(" navigate ");
      navigate("/" + url);
            
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
        <button style={{ pointerEvents: "auto" }}>friends</button>

        {/* HOW DO ROUTES WORK?? */}
 
        </div>
        </div>

        {/* whats going on here exactly? */}
        
        {buildRoutes(inPost)}

        <div id="map" style={{ width: '100vw', height: '100vh' }}></div>

        {/* <div id="map"></div> */}
        </>

        );

    }