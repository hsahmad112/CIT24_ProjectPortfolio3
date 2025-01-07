import { useEffect, useState } from 'react';
import { GetPersonBookmarks, GetTitleBookmarks } from '../../Service/BookmarkService';
import { Container, Row, Tab, Tabs} from 'react-bootstrap';
import TitleWatchlistCard from '../../Component/TitleComponents/TitleWatchlistCard';
import PersonWatchlistCard from '../../Component/PersonComponents/PersonWatchlistCard';
import Pagination from 'react-bootstrap/Pagination';
import { GetHeader, useUser } from '../../Store/Store';
import { useNavigate } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import { DeletePersonBookmarksById, DeleteTitleBookmarksById } from '../../Service/BookmarkService';


export default function WatchList(){
  const [personBookmarks, setPersonBookmarks] = useState(null);
  const [titleBookmarks, setTitleBookmarks] = useState(null);

  const [titleBookmarkPage, setTitleBookmarkPage] = useState(0); //The page we are on
  const [titleBookmarkTotalPages, setTitleBookmarkTotalPages] = useState(1); //number of pages in total, we will set state to value recieved from backend
  const [titleBookmarkPagenationItems, setTitleBookmarkPagenationItems] = useState([]); //State is containing the Pagenation components, that is filled below 
  
  const [personBookmarkPage, setPersonBookmarkPage] = useState(0); 
  const [personBookmarkTotalPages, setPersonBookmarkTotalPages] = useState(1);
  const [personBookmarkPagenationItems, setPersonBookmarkPagenationItems] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null);
  const [timer, setTimer] = useState(5);
  let navigate = useNavigate();

  let headers = GetHeader();
  
  const pageSize = 5;

  const {logout} = useUser();
  const titleBookmarkQueryParams = { //Used for pagenation, we send these queryParams when fetching bookmarks in BookmarkService
    page: titleBookmarkPage,  //Both params are set to state
    pageSize: pageSize  
  };

  const personBookmarkQueryParams = {
    page: personBookmarkPage, 
    pageSize: pageSize  
  };

  const handleTitleBookmarkPageChange = (page) => {
    setTitleBookmarkPage(page);
  };

  const handleDeleteTitleBookmark = async (titleId) => {
    try {
      const success = await DeleteTitleBookmarksById(titleId, headers)
      if(success){
        setTitleBookmarks((prev) =>
        prev.filter((bookmark) => bookmark.titleId !== titleId)
        )
      }
    } catch (error) {
      console.error("Failed to delete titleBookmark");
    }
  } 

  const handlePersonBookmarkPageChange = (page) => {
    setPersonBookmarkPage(page);
  };

  const handleDeletePersonBookmark = async (personId) => {
    try {
      const success = await DeletePersonBookmarksById(personId, headers)
      if(success){
        setPersonBookmarks((prev) =>
        prev.filter((bookmark) => bookmark.personId !== personId)
        )
      }
    } catch (error) {
      console.error("Failed to delete personBookmark");
    }
  } 
      
  useEffect(() =>{
    const getBookmarks = async () => {
      const personBookmarks = await GetPersonBookmarks(personBookmarkQueryParams);  
      if (personBookmarks.success){
        try {
          setPersonBookmarks(personBookmarks.data.entities); 

          setPersonBookmarkTotalPages(personBookmarks.data.numberOfPages); 
        } 
        catch (error) {
          console.error('Error fetching data:', error);
        }
      } 
      else {
        
        if(personBookmarks.message === "401"){
          setErrorMessage("401");
        }
      }           
    }   
    getBookmarks();

  }, [personBookmarkPage]);

  useEffect(() =>{
    const getBookmarks = async () => {
      const titleBookmarks = await GetTitleBookmarks(titleBookmarkQueryParams);
      
      if (titleBookmarks.success){
        try {
          setTitleBookmarks(titleBookmarks.data.entities);

          setTitleBookmarkTotalPages(titleBookmarks.data.numberOfPages);
        } 
        catch (error) {
          console.error('Error fetching data:', error);
        }
      } 
      else {
        
        if(titleBookmarks.message === "401" ){
          setErrorMessage("401");
        }
      }           
    }   
    getBookmarks();

  }, [titleBookmarkPage]);

  useEffect(() => {
    let countDown;
    if (errorMessage === "401") { //Logout if not authorized
        const cookieExpired = true;
            countDown = setInterval(() => {
                setTimer((t) => {
                    if(t <=0){
                        clearInterval(countDown); //Stops countDown timer from continously running //as in UserRating this line is redundant 
                        logout(cookieExpired);
                        return 0; //timer state is set to 0
                    }
                    return t - 1; //aka subtract 1 sec from timer
                })
            }, 1000);  
    }    
    return () => clearInterval(countDown); //Stops timer from continuing to run, after useEffect has executed   

  }, [errorMessage]);

  useEffect(() =>{ //Effect for Title Bookmark pagenation
      const titleBookmarks = [];
            
      for (let number = 0; number <= titleBookmarkTotalPages-1; number++) { //dynamically adding numbered buttons to the Pagenation, according to number of pages
        titleBookmarks.push(
          <Pagination.Item
            key={number}
            active={number === titleBookmarkPage}
            onClick={() => handleTitleBookmarkPageChange(number)}
          >
            {number+1} {/* Plus 1, as page starts at 0, we want to display 1 to user*/}
          </Pagination.Item>
        );
      }
    setTitleBookmarkPagenationItems(titleBookmarks);
    
  }, [titleBookmarkTotalPages, titleBookmarkPage]);
  
  useEffect(() =>{ //Effect for Person Bookmark pagenation
    const personBookmarks = [];
          
    for (let number = 0; number <= personBookmarkTotalPages-1; number++) {
      personBookmarks.push(
        <Pagination.Item
          key={number}
          active={number === personBookmarkPage}
          onClick={() => handlePersonBookmarkPageChange(number)}
        >
          {number+1} {/* Plus 1, as page starts at 0, we want to display 1 to user*/}
        </Pagination.Item>
      );
    }
    setPersonBookmarkPagenationItems(personBookmarks);
    
  }, [personBookmarkTotalPages, personBookmarkPage]);

  return(
    <>
      {errorMessage !== "401" &&
        <div className="container">
          <h1>Your Watchlist</h1>
          <Tabs
            defaultActiveKey="Titles"
            id="uncontrolled-tab-example"
            className="mb-3">
              <Tab eventKey="Titles" title="Titles">
                List of Title Bookmarks:
                <Container>
                  <Row xs={1} md={4}> 
                      {titleBookmarks?.map((title, index) => <TitleWatchlistCard data={title} key={index} onDelete={handleDeleteTitleBookmark}></TitleWatchlistCard>)}     
                  </Row>
                  <Row>
                      <div>
                          <Pagination>{titleBookmarkPagenationItems}</Pagination>
                          <br />
                      </div>
                  </Row>
                </Container>
              </Tab>
              <Tab eventKey="Persons" title="Persons">
                List of Person Bookmarks:
                <Container>
                  <Row xs={1} md={4}> 
                      {personBookmarks?.map((person, index) => <PersonWatchlistCard data={person} key={index} onDelete={handleDeletePersonBookmark}> </PersonWatchlistCard>)}  
                  </Row>
                  <Row>
                      <div>
                          <Pagination>{personBookmarkPagenationItems}</Pagination>
                          <br/>
                      </div>    
                  </Row>
                </Container>
              </Tab>
          </Tabs>          
        </div>
      }
      {errorMessage === "401" &&
        <Alert key={"danger"} variant={"danger"}>
          Warning!! You are not logged in! {" " /* Adds a space between text and "Click here"*/}
          <Alert.Link onClick={() => navigate("/login")}>{"Click here"}</Alert.Link>. if not redirected within {timer== 1 ? `${timer} second` : `${timer} seconds` }
        </Alert> 
      } 
    </>
  
  );
  
}