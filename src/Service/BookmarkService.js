//https://localhost:7154/api/bookmarks/person/2
import axios from 'axios';
import { GetHeader } from "../Store/store";

const baseApiUrl = process.env.REACT_APP_BASE_API_LINK;
const baseMovieURL_ById = process.env.REACT_APP_TMDB_API_IMAGE_BY_ID_LINK;
const api_key = process.env.REACT_APP_TMDB_API_KEY;

// Use find so get title or person from tmdb api: 
// Link: "https://api.themoviedb.org/3/find/" + ID +"?external_source=imdb_id&api_key=" + API_KEY

let headers = GetHeader();

export async function GetTitleBookmarks(){ 
    try {
        const response = await fetch(baseApiUrl + "bookmarks/title/", {headers});

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
}

export async function GetPersonBookmarks(){
    try {
        const response = await fetch(baseApiUrl + "bookmarks/person/", {headers});

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
}

export async function GetPersonBookmarksById(id){
    try {
        const response = await fetch(baseApiUrl + "bookmarks/person/" + id, {headers});

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return data
    } catch (error) {
        console.error("Error fetching data:", error);
        //return null;
    }
    
}

export async function GetPersonBackdrop(id){ // This function does the exact same thing as the function in TitleService: GetTitleBackdrop(id)
    try {
        const url = baseMovieURL_ById + id + '?external_source=imdb_id&api_key=' + api_key;
        const response = await fetch(url);
 
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return data
    
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

export async function GetTitleBackdrop(id){ // This function does the exact same thing as the function in TitleService: GetTitleBackdrop(id)
    try {
        const url = baseMovieURL_ById + id + '?external_source=imdb_id&api_key=' + api_key;
        const response = await fetch(url);
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();

        // Determine which array contains data
        let result = null;

        // could not use the switch, had to do the if else statements instead!
        if (data.movie_results && data.movie_results.length > 0) {
            result = data.movie_results;
        } else if (data.tv_results && data.tv_results.length > 0) {
            result = data.tv_results;
        } else if (data.tv_episode_results && data.tv_episode_results.length > 0) {
            result = data.tv_episode_results;
        } else if (data.tv_season_results && data.tv_season_results.length > 0) {
            result = data.tv_season_results;
        }

        return result;


    } catch (error) {
        console.error("Error fetching data:", error);
    }  

}

export async function SavePersonBookmarksById(personId, annotation){
    try {
        const response = await axios.post(baseApiUrl + "bookmarks/person/", { personId, annotation }, {headers});

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return data
    } catch (error) {
        console.error("Error fetching data:", error);
    }

}

export async function DeletePersonBookmarksById(personId){
    try {
        const response = await axios.delete(baseApiUrl + `bookmarks/person/${personId}`, {headers});

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
}

export async function SaveTitleBookmarksById(titleId, annotation){
    try {
        const response = await axios.post(baseApiUrl + "bookmarks/title/", { titleId, annotation },  {headers});

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
}

export async function DeleteTitleBookmarksById(titleId){
    try {
        const response = await axios.delete(baseApiUrl + `bookmarks/title/${titleId}`, {headers});

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
}