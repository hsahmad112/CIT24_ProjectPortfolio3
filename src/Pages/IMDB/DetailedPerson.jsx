import { useUser, GetHeader } from "../../Store/Store";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Toaster from "../../Component/Toaster";
import { GetPerson, GetPersonBackdrop } from "../../Service/PersonService";
import { Card, Col, Row, Container, Stack, Button, Modal, Spinner, Badge } from 'react-bootstrap';
import { CreatePersonBookmarksById, DeletePersonBookmarksById, IsPersonBookmarked, UpdatePersonBookmark} from '../../Service/BookmarkService';
import * as Icon from 'react-bootstrap-icons';

export default function DetailedPerson(){
    const imageUrl = process.env.REACT_APP_TMDB_API_IMAGE_LINK;
    
    const { token } = useUser(); //state from context
    const {checkToken} = useUser(); //helper function to check if token is null i.e user not logged in 
    const headers = GetHeader(); //helper function, builds the header used in HTTPS request 
    const params = useParams(); 
    
    const [showNotLoggedIn, setShowNotLoggedIn] = useState(false); //bool for Toaster informing user not logged in

    const [person, setPerson] = useState(null);  //state for handling storing the person fetched

    const [personBackdrop, setPersonBackdrop] = useState(null);

    // states for bookmark handling
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showBookmarkModal, setShowBookmarkModal] = useState(false);
    const [showBookmarkPop, setShowBookmarkPop] = useState(false);
    const [ShowRemovePopBookmark, setShowRemovePopBookmark] = useState(false);
    const [showUpdateBookmarkPop, setShowUpdateBookmarkPop] = useState(false);
    const [annotation, setAnnotation] = useState('');

    useEffect(()=>{
        window.scrollTo(0, 0);
        const fetchData = async () => {
          try {
            setPerson(await GetPerson(params.id)); 
            setPersonBackdrop( await GetPersonBackdrop(params.id));

            if(checkToken() !== null){ //checks if user is logged in..
                IsPersonBookmarked(params.id, setIsBookmarked, headers); //...check if person is bookmarked for the user     
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
        console.log(isBookmarked);
    }, [isBookmarked, params.id, token] );

    async function ToggleBookmark(){ //handles create and delete functionality for bookmark
        if(token !== null){
            if(isBookmarked === false){      
                const success = await CreatePersonBookmarksById(params.id, annotation, setIsBookmarked, headers);
            
                if( success){ 
                    setShowBookmarkPop(true);
                    setTimeout(() => {setShowBookmarkPop(false)}, 2500);
                }
                else{
                    console.warn("No bookmark was created.")
                }
            }
            else if(isBookmarked === true){
              const success =  await DeletePersonBookmarksById(params.id, headers);     
              if(success){
                setIsBookmarked(false);
                setShowRemovePopBookmark(true);
                setTimeout(() => {setShowRemovePopBookmark(false)}, 2500);
              }  
            }   
        }      
        else{
            setShowNotLoggedIn(true); 
            setTimeout(() => {setShowNotLoggedIn(false)}, 2500);
        }     
    }

    function CloseBookmarkModal(){
        setShowBookmarkModal(false);
    }

    const handleAnnotationChange = (e) => {
        const {value } = e.target;
        setAnnotation(value);
        console.log(annotation);
    };

    const updateBookmark = (e) => {
        UpdatePersonBookmark(params.id, headers, annotation);    
        setShowBookmarkModal(false);
        setShowUpdateBookmarkPop(true);        
        setTimeout(() => {setShowUpdateBookmarkPop(false)}, 2500);
    }
    function displayBookmarkModal(){
        if(isBookmarked){
            setShowBookmarkModal(true);
        }
    }
      

    if(!person){
        return(
          <div style={{textAlign: "center !important", transform: "translate(0%, 500%)"}}>
            <h1 style={{display: "inline"}}><b>loading... </b></h1>
            <Spinner animation="border" role="status"/>
          </div>
        );
      }
      else{    
           
        let mostRelevantTitles = <>{person.mostRelevantTitles.map((title, index) => <Button variant={"secondary"} className="pills" key={index}>{title}</Button>)}</>
        let primaryProfessions = <>{person.primaryProfessions.map((profession, index) => <Badge bg="secondary" className="pills" key={index}>{profession}</Badge>)}</>
    

        return ( // refactoring into seperate components (bookmarks)
            <div className="container">
                <Container fluid="true">

                    <Row style={{marginTop: "10px", marginBottom: "10px"}}>
                        <Col width="100%">
                            <h1 className="less-opacity" style={{textAlign: 'left'}}>
                                {person.name}                     
                            </h1>
                        </Col>
                        <Col md={1}>
                            <Row>
                                <Col onClick={displayBookmarkModal} style={{cursor: 'pointer', marginTop: '10px', textAlign: 'right'}}>
                                    <Icon.PencilFill  style={{color: 'purple', visibility:isBookmarked ? "visible" : "hidden"}} />
                                </Col>
                                <Col onClick={ToggleBookmark} style={{cursor: 'pointer', marginTop: '10px', textAlign: 'right'}}>
                                    { isBookmarked  ? <Icon.BookmarkFill size={20} style={{color: 'darkgreen'}}/> : <Icon.Bookmark size={20} style={{color: ''}}/> }
                                </Col> 
                            </Row>                
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4 }>                          
                            {/* column for poster img with person */}
                            <Card bg="transparent d-flex align-items-center" style={{ width: '14rem', padding: '0px' }}>
                                <Card.Img 
                                    fluid="true"
                                    variant="bottom"
                                    className=""
                                    src={                      
                                        personBackdrop?.profile_path ? 
                                        imageUrl + personBackdrop?.profile_path :
                                        "/no-image.jpg"
                                    } />                           
                            </Card>                       
                        </Col>

                            {/* column for plot, actors, writers */}
                        <Col md={4}>                   
                            <Stack  style={{height: '100%'}}>
                                <div className="p-2"  style={{height: '100%'}}>    
                                    <Card className="card-no-margin" >
                                        <Card.Body>
                                            <div>
                                                <h6>{person.birthYear && "Birth year: " +person.birthYear}</h6>
                                                <h6>{person.deathYear && "Death year: " +person.deathYear}</h6>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                                
                                {/* row for plot */}
                                <div className="p-2">    
                                    <Card className="card-no-margin">
                                        <Card.Body>
                                            <h5>Relevant Titles</h5>
                                            <Card.Text className="">
                                            {mostRelevantTitles}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                                
                                {/* row for actors */}
                                <div className="p-2">
                                    <Card className="card-no-margin">
                                        <Card.Body>
                                            <h5>Primary Profession</h5>
                                            {primaryProfessions}
                                            <Card.Text className="">
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                                
                            {/* row for writers */}
                                <div className="p-2">
                            
                                </div>
                            </Stack>
                        </Col>                  
                    </Row>         
                </Container>

                {showBookmarkModal &&      
                    <div className="modal show" style={{ display: 'block', marginTop: "10%" }}>
                        <Modal.Dialog>
                        <Modal.Header closeButton onClick={() => CloseBookmarkModal()}>
                            <Modal.Title>Bookmark: {person.name}</Modal.Title>
                        </Modal.Header>
                        
                        <Modal.Body>
                                <textarea 
                                    value={annotation}
                                    onChange={(e) => handleAnnotationChange(e)}                  
                                    rows="3"                                    
                                    style={{width: "100%"}}
                                />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => CloseBookmarkModal()}>Cancel</Button>
                            <Button variant="primary" onClick={() => updateBookmark()}>Update</Button>
                        </Modal.Footer>
                        </Modal.Dialog>
                    </div>
                }
                
                <Toaster header={"Authorization"} body={"Your are not logged in."} show={showNotLoggedIn} color={"warning"} />
                <Toaster header={"Removed"} body={"Your have removed this bookmark."} show={ShowRemovePopBookmark} color={"danger"} />              
                <Toaster header={"Success"} body={"Your have bookmarked this title."} show={showBookmarkPop} color={"success"} />
                <Toaster header={"Success"} body={"Your have updated the bookmarked for this title."} show={showUpdateBookmarkPop} color={"success"}></Toaster>
        
                
            </div>
        );

    }
}