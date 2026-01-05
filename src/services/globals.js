//global varibles

// export let allMyPosts = [];
export let canPost = false;

export function getCanPost(){
    return canPost;

}

export function changeCanPost(){
    canPost = !canPost;

}

// export function setAllMyPosts(arr){
//     allMyPosts = arr;

// }