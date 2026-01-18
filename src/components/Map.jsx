import '../index.css';
import { useRef, useEffect, useState } from "react";
import { PostContext } from '../services/PostContext.js'
import { auth } from "../firebase.js";
import mapboxgl from 'mapbox-gl'
import { changeCanPost, getCanPost } from "../services/globals.js";
import { BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import { buildRoutes, setPostRefresh, updatePosts, setPostMarkerRefresh, doDelPost} from '../services/postRepository.jsx';

// main map screen
export default function Map({}) {
    const [curCanPost, setCurCanPost] = useState(false);
    const [inPost, setInPost] = useState(false);
    const [allPosts, setPosts] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [curMarker, setCurMarker] = useState(null);

    const mapRef = useRef(null);
    const navigate = useNavigate();

    function navBack(){
      setInPost(false);
      navigate(-1); 
    }

    // delete posts
    async function delPost(url){
      console.log("del post");

      // elete post in backend
      const updatedPosts = await doDelPost(url);
      setPosts(updatedPosts); 

      setRefresh(r => r + 1);
      
    }

    useEffect(() => {
    if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN){
        console.error('mapbox access token is not defined');
        return;
    }

    async function navTo(url){ 
      console.log(" navigate ");
      navigate("/" + url);     
    }

    // create new post
    const handleMapClick = async (e) => {
      
      const coords = e.lngLat;
      if (getCanPost()) {

      changeCanPost();// in file
      setCurCanPost(false);// global
      
      const url = crypto.randomUUID();

      // update current posts in backend
      const updatedPosts = await updatePosts(coords, url, allPosts);

      setPosts(updatedPosts); 
      
      // set new pin on map
      const Marker = new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]).addTo(mapRef.current);
  
      Marker.getElement().addEventListener("click", ()=> {
        console.log("got to initalize");

        setCurMarker(Marker);
        console.log("marker: ", Marker);
        handlePostClick(url);
      });

      console.log("got here");

      try{
      Marker.getElement().classList.add("post-pin");
      }catch(d){
        console.log("marker error !");
      }
      }
    }


    // set map
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    mapRef.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/chrisrudzki/cmg6z3e6a00ew01rjdn9u35kw',
      center: [-74.5, 40],
      zoom: 9,
    });

    mapRef.current.setCenter([-123.312310125458, 48.464145303790666]);
    mapRef.current.setZoom(13.5);

    mapRef.current.on('click', handleMapClick);

    //after mapRef is created dirNavigate
    setPostMarkerRefresh(mapRef, navTo, setCurMarker);

    }, []);

   
    const logout = async () => {
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

    // refresh page with post routes
    useEffect(() => {
      async function setRoutesFunc(){
        const myPosts = await setPostRefresh();
        setPosts(myPosts);
      }
      setRoutesFunc();

      }, [refresh]);


    return (
    <>
        <div class="overlay-map" style={{ pointerEvents: "none" }}>
        
        <button onClick={logout}style={{ pointerEvents: "auto" }}>log out</button>
        
        <div class="right-side-bar">
        
        <button onClick={handlePostButton} style={{ pointerEvents: "auto", backgroundColor: curCanPost ? "red" : "unset" }}>post</button>

        <button style={{ pointerEvents: "auto" }}>profile</button>
        <button style={{ pointerEvents: "auto" }}>friends</button>

        
        </div>
        </div>

        
       <PostContext.Provider value={{ refresh, setRefresh, navBack, setInPost, delPost, curMarker}}>
    <div className="overlay-post" style={{ pointerEvents: inPost ? "auto" : "none" }}>
       <Routes>
           {
           allPosts.map( Post => (
             Post
           ))
          }
        </Routes>
     </div>
       </PostContext.Provider>
        <div id="map" style={{ width: '100vw', height: '100vh' }}></div>
        </>
        );
    }