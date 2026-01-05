import { useRef, useEffect, useState, useContext, createContext } from "react";
import { PostContext } from '../services/PostContext.js'

import { auth, Firestore } from "../firebase.js";
import mapboxgl from 'mapbox-gl'
import { canPost, changeCanPost, getCanPost } from "../services/globals.js";
import '../index.css';

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import { buildRoutes, setPostRefresh, updatePosts, setPostMarkerRefresh, doDelPost} from '../services/postRepository.jsx';

export default function Map({}) {
    const [curCanPost, setCurCanPost] = useState(false);
    const [inPost, setInPost] = useState(false);

    const [allPosts, setPosts] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [myRoutes, setRoutes] = useState([]);
    const [curMarker, setCurMarker] = useState(null);

    const mapRef = useRef(null);
    // const myRef = useRef(null);
    const navigate = useNavigate();

    // let myRoutes = [];

    function navBack(){
      setInPost(false);
      navigate(-1); 
    }

    async function delPost(url){
      console.log("del post");
      const updatedPosts = await doDelPost(url);
      setPosts(updatedPosts); // now it's actual data

      setRefresh(r => r + 1);
      console.log("refresh: ", refresh);
      //this should refresh allPosts, but it doesnt, make delPosts edit firebase then incroment refresh value
    }

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

    
    
    //new post
    const handleMapClick = async (e) => {
      console.log("here2");
      const coords = e.lngLat;
      console.log("cp", getCanPost());
      if (getCanPost()) {
      //
      console.log("inside !", getCanPost());

      changeCanPost();//in file
      setCurCanPost(false);//global
      
      //set is_post value 
      const url = crypto.randomUUID();

      const updatedPosts = await updatePosts(coords, url, allPosts);
      setPosts(updatedPosts); // now it's actual data
      
      const Marker = new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]).addTo(mapRef.current);
      
      // console.log("lat", coords.lng, "long", coords.lat)
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

      // mapRef.current.on('load', () => {

      //after mapRef is created dirNavigate
      setPostMarkerRefresh(mapRef, navTo, setCurMarker);

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

    // refresh page with routes of posts
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

       <PostContext.Provider value={{ refresh, setRefresh, navBack, setInPost, delPost, curMarker}}>
    <div className="overlay-post" style={{ pointerEvents: inPost ? "auto" : "none" }}>
       <Routes>
           {
           allPosts.map( Post => (
              // console.log("post: path", Post.key),
             Post
           ))
          }
        </Routes>
     </div>
       </PostContext.Provider>
      
        <div id="map" style={{ width: '100vw', height: '100vh' }}></div>

        {/* <div id="map"></div> */}
        </>

        );

    }