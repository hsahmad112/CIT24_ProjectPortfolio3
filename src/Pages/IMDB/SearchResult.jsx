import SearchPreview from "../../Component/SearchPreview";
import { useLocation } from "react-router";
import { GetHeader, useUser } from "../../Store/Store";
import { useEffect} from 'react';
import { PaginationForSearch } from "../../Helpers/URLHelper";
//SearchResult should ideally not handle searching, but only displaying search results.
//Ideally a "SearchService.js" would handle fetching results based on inputs sent from SearchField, then represented by SearchResult


//Function that handles returning search results. 
//Takes searchType (Everything/Person/Title), body object from the SearchField
 export async function FetchData(searchType, body){   
  
    let headers = GetHeader();
    
    const baseUrl = process.env.REACT_APP_BASE_API_LINK;
    const fetchUrlTitle = "/advanced-search?searchTerm=" + body.searchTerm + PaginationForSearch(body.page, body.pageSize);
    const fetchUrlPerson = "/search?searchTerm=" + body.searchTerm + PaginationForSearch(body.page, body.pageSize);

    switch (searchType) {
        case "everything":
            //returns both titles and persons, fethces concurrently using Promise.All, 
            const [personResponse, titleResponse] = await Promise.all([
                fetch(baseUrl  + "persons" + fetchUrlPerson, {headers}),
                fetch(baseUrl + "titles" + fetchUrlTitle),
            ]);
           
            //If response of either person or title is not HTTP OK status code, then we use the below 2 empty arrays to pass on 
            let personData = [];
            let titleData = [];

            if(personResponse.ok){
                //server response to fetch gets parsed to js object
                personData = await personResponse.json();  
            }
            else {
                console.warn("No persons found from search. Status code: ", personResponse.status); //Including HTTP status code in warning 
                personData = null; //Possibly not doing anything
            }

            if(titleResponse.ok){
                //server response to fetch gets parsed to js object
                titleData = await titleResponse.json();
            }
            else {
                console.warn("No titles found from search. Status code: ", titleResponse.status)
                titleData = null; //Possibly not doing anything
            }
            //returns object containing results containing persons and titels (possibly empty) //<-- wrong, the data arrays would prossibly be null
            return{persons: personData, titles: titleData};
            
        default:
            const urlType = searchType === "persons" ? fetchUrlPerson: fetchUrlTitle; //should not rely on ternary as logic could be handled by switch case - Would make it easier for future implementation
            const response = await fetch(baseUrl + searchType + urlType, {headers});
            if(response.ok){
                const data = await response.json();
                return {persons: data, titles: data}; //Should props find a better way, than duplicating data in persons/titles.... //relying on ternary logic above, results this rather confusing object being returned to SearchField 
            }
            else {
                console.error(`Could not fetch ${searchType}`, response.status)
                
            }      
    } 
}   

// All advanced search is for titles and handled here 
export async function AdvancedSearch(body) {
    let headers = GetHeader();
    
    const baseUrl = process.env.REACT_APP_BASE_API_LINK;
    const searchTerm = body.searchTerm === undefined ? "" : body.searchTerm;
    const genreId = body.genreId === undefined ? "" : body.genreId;
    const startYear = body.startYear === undefined ? "" : body.startYear;
    const endYear = body.endYear === undefined ? "" : body.endYear;
    const rating = body.rating === undefined ? "" : body.rating;
    const paging = PaginationForSearch(body.page, body.pageSize);
    const fetchAdvancedUrl = "/advanced-search?searchTerm=" + searchTerm + "&genreId=" + genreId + "&startYear=" + startYear + "&endYear=" + endYear + "&rating=" + rating + paging;
    
    //console.log(fetchAdvancedUrl);
    //no error handling being done
    const titleResponse = await fetch(baseUrl  + "titles" + fetchAdvancedUrl, {headers});
    const response = await titleResponse.json();
    return{titles: response};   
}

export default function SearchResult(){
    //location gives us access to states passed through navigation.js  
    // above is wrong - passed through SearchField USING navigate()
    const location = useLocation();

    const {token, checkToken} = useUser();
 
    let result, searchType;
    if (location?.state?.result){  
        result = location.state.result;
        searchType = location.state.searchType; 
    }   else {
        console.error("NOTE TO DEV: Location state is not defined"); 
    }   


    const selectedEntities = {}; //One object for searchResult, used to store both title/persons indivually depending on the case:
    const body = location?.state?.body;
     switch (searchType) {
        case "everything":
            selectedEntities.persons = result?.persons || [];
            selectedEntities.titles = result?.titles ||  [];
           
            console.log("this is our everything entity");
            console.log(selectedEntities);
            break;
        case "titles":
            selectedEntities.titles = result?.titles || [];
            console.log("this is our title entity");
            console.log(selectedEntities);
            break;
        case "persons":
            selectedEntities.persons = result?.persons || [];
            console.log("this is our person entity");
            console.log(selectedEntities);
            break;
        default:
            console.warn("Selected advanced search feature is invalid or not correct")
            result = undefined; //This will trigger warning shown in UI, as below in return:
            break;
     }

    const personType = "personType";
    const titleType = "titleType";
    
    useEffect(() => {
        checkToken(); //Calls checkToken, which sets token state to null if it is expired or not present. When null, login/signup appear on navbar     
    }, [token]);

    return(
        <div className="container" >
            {console.log("entities:", result)}
            {result === undefined && <p>No results found</p>}
            { searchType === 'everything' &&(
                <>
                    <SearchPreview componentType={personType} body={body} searchResult={selectedEntities.persons} />
                    <SearchPreview componentType={titleType} body={body} searchResult={selectedEntities.titles} />   
                </>       
                )
            }
            { searchType === 'persons' && selectedEntities?.persons.entities?.length > 0 && (
                <>
                    <SearchPreview componentType={personType} body={body} searchResult={selectedEntities.persons} />
                </>
                )
            }
            { searchType === 'titles' && selectedEntities?.titles?.entities?.length > 0 && (
                <>
                    <SearchPreview componentType={titleType} body={body} searchResult={selectedEntities.titles} />  
                </>
                )
            }     

        </div>
    );
}

