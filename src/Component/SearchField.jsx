import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {FetchData, AdvancedSearch}  from '../Pages/IMDB/SearchResult';
import {useUser} from "../Store/Store";
import {Button, Form, InputGroup, Dropdown, Col, Row} from 'react-bootstrap';
import {GetGenres} from '../Service/GenreService';

export default function SearchField(){ //SearchComponent present in Navigation bar
    //States for default search functionality
    const {searchType, setSearchType } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("Everything");

    //States for advanced search functionality, with multiple parameters
    const [chosenGenre, setChosenGenre] = useState(undefined);
    const [chosenStartYear, setChosenStartYear] = useState(undefined);
    const [chosenEndYear, setChosenEndYear] = useState(undefined);
    const [chosenRating, setChosenRating] = useState(undefined);
    const [genres, setGenres] = useState([]);

    //Placeholder txt for search field
    const [placeholderText, setPlaceholderText] = useState("Search for Everything");
    
    let navigate = useNavigate();

    function handleSearchFieldInputChange(e){ 
        setSearchQuery(e.target.value);
    }
    
    useEffect(()=>{
      const fetchData = async () => {
        try {
          setGenres(await GetGenres());
        }catch (error) {
          console.error('Error fetching data in Navigation:', error);
        }
      };

      fetchData();
    },[]);
    
    function handleType(e){ //Helper function for setting what the user search for: Everything, Person and Title
        const newSelectedCategory = e.target.getAttribute('name');
        const newSelectedType = e.target.getAttribute('str');
        setSearchType(newSelectedType);
        setSearchCategory(newSelectedCategory);
        setPlaceholderText("Search for " + newSelectedCategory); 
    }

    async function handleSubmit(e){
        e.preventDefault();
        const body = //Object prop containing search parameters, forwarded to SearchPreview and SearchResult
        { id: null, 
            searchTerm: searchQuery, 
            page: '0', 
            pageSize: searchType === 'everything' ? '5' : '10',
            genreId: chosenGenre,
            startYear: chosenStartYear,
            endYear: chosenEndYear,
            rating: chosenRating
        };
    
        try {

            let result;
            if(chosenGenre !== undefined || chosenRating !== undefined || chosenStartYear !== undefined || chosenEndYear !== undefined){
              result = await AdvancedSearch(body);
            }
            else{
              result = await FetchData(searchType, body);
            }
            setChosenGenre(undefined);
            setChosenStartYear(undefined);
            setChosenEndYear(undefined);
            setChosenRating(undefined);

            navigate('/search', {
            state: {result, searchType, body }, //Pass state when navigating to /search
            });

        } catch (error) {
            console.error("Error in fetching of data, in Navigation.js", error);
        }
    }

    return (
      <Form inline="true" onSubmit={handleSubmit}>
        <Row>
          <Col md="auto"> 
            <Dropdown>
              <Dropdown.Toggle style={{ backgroundColor: (chosenGenre === undefined && chosenRating === undefined && chosenStartYear === undefined && chosenEndYear === undefined) ? "": "black"}} className='advanced-dropdown' variant="success">
                <div style={{ color: "white" }}>Advanced Search</div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <label for="genres">Genres</label>
                <select name="genres" onChange={(e) => setChosenGenre(e.target.value === "choose" ? undefined : e.target.value)}>
                  <option style={{color: "gray"}}>choose</option>
                  {genres?.map((item, index) =>
                    <option value={index + 1} key={item.name}>{item.name}</option>
                  )}
                </select> 
                <label for="rating">Rating</label>
                <input onChange={(e) => setChosenRating(e.target.value === "" ? undefined : e.target.value)} type='number' placeholder='rating'></input>
                <input onChange={(e) => setChosenStartYear(e.target.value === "" ? undefined : e.target.value)} type='number' placeholder='startYear'></input>
                <input onChange={(e) => setChosenEndYear(e.target.value === "" ? undefined : e.target.value)} type='number' placeholder='endYear'></input>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col>
            <InputGroup>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {searchCategory}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick = {handleType} str="everything" name= "Everything" >Everything</Dropdown.Item>
                  <Dropdown.Item onClick = {handleType} str="titles" name= "Titles" >Title</Dropdown.Item>
                  <Dropdown.Item onClick = {handleType} str="persons" name="Persons">Person</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control
                placeholder={placeholderText}
                aria-label="Search Term"
                aria-describedby="nav-bar-search"     
                onChange= {handleSearchFieldInputChange}/>
              <Button type='submit'><i className="bi bi-search"></i></Button>
            </InputGroup>
          </Col>
        </Row>
      </Form>
    );

}