import TitleSearchCard from './TitleComponents/TitleSearchCard';
import PersonSearchCard from './PersonComponents/PersonSearchCard';
import {Button, Row} from 'react-bootstrap'
import {useEffect, useState} from 'react';
import {PaginationForSearch} from '../Helpers/URLHelper';

export default function SearchPreview({ componentType, body, searchResult }) { //Component encapsulating the search results, having PersonSearchCard/TitleSearchCard within
  const baseUrl = process.env.REACT_APP_BASE_API_LINK;

  const [result, setResult] = useState(searchResult.entities); //State set to prop passed from SearchResult 
  const [page, setPage] = useState(body.page); //Current page
  const [errorMessage, setErrorMessage] = useState("");

  //Helper method for generating titles, uses prop object from SearchField  
  function TitleUrlGenerator(page){ // Ambiguous parameter name as it represends the next page (page state + 1)
    const searchTerm = body.searchTerm === undefined ? "" : body.searchTerm;
    const genreId = body.genreId === undefined ? "" : body.genreId;
    const startYear = body.startYear === undefined ? "" : body.startYear;
    const endYear = body.endYear === undefined ? "" : body.endYear;
    const rating = body.rating === undefined ? "" : body.rating;
    const paging = PaginationForSearch(page, body.pageSize);

    //Returns the url for current page
    return "/advanced-search?searchTerm=" + searchTerm + "&genreId=" + 
    genreId + "&startYear=" + startYear + "&endYear=" + endYear + "&rating=" + rating + paging;
  }
  function PersonUrlGenerator(page){ //Helper method
    const searchTerm = body.searchTerm === undefined ? "" : body.searchTerm;
    const paging = PaginationForSearch(page, body.pageSize);
    return "/search?searchTerm=" + searchTerm + paging;
  }
  useEffect(()=>{ //
    setResult(searchResult.entities);
  }, [body, searchResult])
 
  //The URL Generators could be refactored into two method for readability
  async function LoadMore() { //fetches more SearchCards (if any)
    if(componentType === "personType"){
      const type = "persons";
      const nextPage = page + 1

      const personResponse = await fetch(baseUrl + type + PersonUrlGenerator(nextPage), {});
      const data = (await personResponse.json()).entities;

      if(data) {
        setResult([...result, ...data]);
        setPage(x => parseInt(x) + 1);  // Use nextPage instead of the lambda expression
      }
      else {
        setErrorMessage("No more results");
      }
    }
    else{
      const type = "titles";
      const nextPage = page + 1;
      
      const titleResponse = await fetch(baseUrl + type + TitleUrlGenerator(nextPage), {});
      const data = (await titleResponse.json()).entities;
      
      if(data) {
        setResult([...result, ...data]);
        setPage(x => parseInt(x) + 1); // is it not supposed to set the state and be used before the next render if written like so?
      }
      else {
        setErrorMessage("No more results");
      }
    }
  }

    return (
      <div style={{textAlign: 'left'}}>
        <h1>{componentType === "personType" ? "Persons" : "Titles"}</h1>
        <Row md={3}>
          {
            searchResult.entities?.length > 0 ?
            result?.map((e) => (
              componentType === "personType" ? 
              <PersonSearchCard person={e} key={e.personId}/> :
              <TitleSearchCard title={e} key={e.titleId}/>
            )) : <p>No results for {componentType === "personType" ? "persons" : "titles"}</p>    
          }
        </Row>
        {(errorMessage || !Array.isArray(searchResult.entities)) ? <p>{errorMessage}</p> :
         <Button style={{float: 'right', marginRight: "10px"}} onClick={()=> LoadMore()}>See More</Button>}
      </div>
    );
}
