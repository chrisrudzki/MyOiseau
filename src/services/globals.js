//global varibles

export let canPost = false;

export function getCanPost(){
    return canPost;

}

export function changeCanPost(){
    canPost = !canPost;
    
}