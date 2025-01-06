import { useUser, GetHeader } from "../../Store/Store";
import { useEffect, useState } from "react";
import Toaster from "../../Component/Toaster";
import TitleSearchCard from "../../Component/TitleComponents/TitleSearchCard";
import { useParams, useNavigate } from "react-router";
import { GetTitleById, GetSimilarMovies } from "../../Service/TitleService";
import { PostRating, GetRatingById, PutRating, DeleteRating} from "../../Service/RatingService";
import { CreateTitleBookmarksById, DeleteTitleBookmarksById, IsTitleBookmarked, UpdateTitleBookmark } from "../../Service/BookmarkService";
import { DisplayYears, DisplayRatingCount } from "../../Helpers/DisplayHelpers";
import { Card, Col, Row, Container, Stack, Button, Modal, Spinner, Badge } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

export default function DetailedTitle() {
  const {token, checkToken} = useUser();
  const params = useParams();
  const [showNotLoggedIn, setShowNotLoggedIn] = useState(false);

  const [title, setTitle] = useState(null); //current title displayed
  const [similarMovies, setSimliarMovies] = useState(null); 

  const list = [1,2,3,4,5,6,7,8,9,10]; //array of possible rating
  //states for rating functionality
  const [rating, setRating] = useState(-1);
  const [prevRating, setPrevRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(-1);
  const [hasRated, setHasRated] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showRatingPop, setShowRatingPop] = useState(false);
  
  //states for bookmark functionality
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showBookmarkPop, setShowBookmarkPop] = useState(false);
  const [showRemoveBookmarkPop, setShowRemoveBookmarkPop] = useState(false);
  const [showUpdateBookmarkPop, setShowUpdateBookmarkPop] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [annotation, setAnnotation] = useState('');
  const [prevAnnotation, setPrevAnnotation] = useState(null);  

  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);  
  
  let navigate = useNavigate();

  useEffect(()=>{ 
    window.scrollTo(0, 0);
    const fetchTitle = async () => {
      try {
        setTitle(await GetTitleById(params.id));        
  
        let tempRating = await GetRatingById(params.id);
        setRating(tempRating);
          
        if(tempRating > -1) setHasRated(true);
        else setHasRated(false);

      } catch (error) {
        setErrorMessage("could not find title with with id: " + params.id);
        console.error('Error fetching data:', error);
      }
    };
    const fetchSimilarTitle = async () => {
      try{
        setSimliarMovies(await GetSimilarMovies(params.id));
      } catch (error){
        console.log("Error when fethcing similar movies");
      }
    }

    fetchTitle();
    fetchSimilarTitle(); // it would show error message when failed to get similar movies, though should only show it when fethcing title fails
  }, [params.id, token]);
  

  useEffect(() => {
    let headers = GetHeader();
    if(checkToken() !== null){
          IsTitleBookmarked(params.id, setIsBookmarked, headers);      
    }
  }, [isBookmarked, params.id]);


 async function ToggleBookmark(){
    let headers = GetHeader();
    if(token !== null){
      if(isBookmarked === false){
        const success = await CreateTitleBookmarksById( params.id, annotation, setIsBookmarked, headers);

        if(success){ 
          setShowBookmarkPop(true);
          setTimeout(() => {setShowBookmarkPop(false)}, 2500);
        }
        else{
          console.warn("No bookmark was created.")
        }
      }
      else if(isBookmarked === true){
        const success = await DeleteTitleBookmarksById(params.id, headers);
        if(success){
          setIsBookmarked(false);
          setShowRemoveBookmarkPop(true);
          setTimeout(() => {setShowRemoveBookmarkPop(false)}, 2500);
        }     
      }  
    }
    else{
      setShowNotLoggedIn(true); 
      setTimeout(() => {setShowNotLoggedIn(false)}, 2500);
    }
  }

  async function RemoveRating(){
    try{
      await DeleteRating(params.id);
      setToastMessage('Your rating was removed');  
      setShowRatingPop(true);
      setTimeout(() => {setShowRatingPop(false)}, 2500);
      setShowRatingModal(false);
      setHasRated(false);
      setRating(-1);
    }
    catch(error){
      console.log("something went wrong");
    }
  }

  async function RateMovie(){
    if(token !== null){
      setToastMessage('Your rating was submitted');
      setShowRatingPop(true);
      setTimeout(() => {setShowRatingPop(false)}, 2500);
      
      setShowRatingModal(false);
      if(hasRated){
        await PutRating(params.id, rating);
      }
      else{
        await PostRating(params.id, rating);
        setHasRated(true);
      }
    }
    else{
      setShowNotLoggedIn(true);
      setTimeout(() => {setShowNotLoggedIn(false)}, 2500);
    }
  }

  function handleShowRatingModal(){
    if(token !== null){
      setShowRatingModal(true);
      setPrevRating(() => rating);
    }
    else{
      setShowNotLoggedIn(true);
      setTimeout(() => {setShowNotLoggedIn(false)}, 2500);
    }
  }

  function CloseRatingModal(){
    setHoverRating(-1);
    setShowRatingModal(false);
  }

  function CloseBookmarkModal(){
    setShowBookmarkModal(false);
  }

  const handleAnnotationChange = (e) => {
    const {value } = e.target;
    setAnnotation(value);
    console.log(annotation);
  };

  const updateAnnotation = (e) => {
    let headers = GetHeader();
    UpdateTitleBookmark(params.id, headers, annotation);    
    setShowBookmarkModal(false);
    setShowUpdateBookmarkPop(true);
    setTimeout(() => {setShowUpdateBookmarkPop(false)}, 2500);
  }
  
  function ShowingBookmarkModal(){
    if(isBookmarked){
      setShowBookmarkModal(true);
      setPrevAnnotation(annotation);
    } 
    else{
      setShowNotLoggedIn(true);
      setTimeout(() => {setShowNotLoggedIn(false)}, 2500);
    }
  }

  if(errorMessage){
    return (
      <div className="center-div">
        <p>{errorMessage}</p>
      </div>
    );  
  }
  
  if(!title){
    return(
      <div style={{textAlign: "center !important", transform: "translate(0%, 500%)"}}>
        <h1 style={{display: "inline"}}><b>loading... </b></h1>
        <Spinner animation="border" role="status"/>
      </div>
    );
  }
  else{
    // title only have the person name, not the id, so can't use them to find the person, the name might overlap
    return (
      <div className="container">
          <Container fluid="true">
            <Row style={{marginTop: "10px", marginBottom: "10px"}}>
                <Col width="100%">
                  <span style={{textAlign: "left"}}>
                    <span style={{position: "absolute"}}>
                          <b style={{display: "inline"}}>IMDB rating: {title.voteCount ? title.averageRating + "/10" : "no ratings"}</b>
                          <p style={{textAlign: "center"}}>{DisplayRatingCount(title.voteCount)}</p>
                      </span>
                      <h1>
                        {title.primaryTitle}
                        <p style={{fontSize: "28px", display: "inline"}}>{DisplayYears(title.startYear, title.endYear)}</p> 
                      </h1>
                      {title.originalTitle !== title.primaryTitle &&
                      <h5 className="less-opacity">{title.originalTitle}</h5>}  
                      <p style={{fontSize: "15px"}}>{title.titleType}</p>
                      {title.isAdult && <p style={{fontSize: "15px"}}>is adult</p>}
                  </span>                    
                </Col>
                <Col md={1}>
                    {/* Toogle function, can be used to save as bookmark! */}                       
                    <Row>
                        <Col onClick={ShowingBookmarkModal} style={{cursor: 'pointer', marginTop: '10px', textAlign: 'right'}}>
                            <Icon.PencilFill  style={{color: 'purple', visibility:isBookmarked ? "visible" : "hidden"}} />
                        </Col>
                        <Col onClick={ToggleBookmark} style={{cursor: 'pointer', marginTop: '10px', textAlign: 'right'}}>
                            { isBookmarked  ? <Icon.BookmarkFill size={20} style={{color: 'darkgreen'}}/> : <Icon.Bookmark size={20} style={{color: ''}}/> }
                        </Col> 
                    </Row>  
                </Col>
              </Row>
            <Row>
              <Col>
                {/* column for poster with title, rating and stuff */}
                <Card bg="transparent d-flex align-items-center no-border" style={{height: "500px"}}>
                  <Card.Img fluid="true"
                    variant="bottom"
                    className="detailed-movie-card"
                    src={title.posterUrl ? title.posterUrl : "/no-image.jpg"}
                    alt={title.primaryTitle}      
                    />
                </Card>
              </Col>

              {/* column for plot, actors, writers */}
              <Col xl={6}>
                <Stack>

                  {/* row for plot */}
                  <div className="p-2">    
                    <Card className="card-no-margin">
                        <Card.Body>
                          <h5>Plot</h5>
                          <Card.Text className="">
                            {title.plot}
                          </Card.Text>
                        </Card.Body>
                    </Card>
                  </div>
                  
                  {/* row for actors */}
                  <div className="p-2">
                    <Card className="card-no-margin">
                        <Card.Body>
                          <h5>Actors</h5>
                            {title.principalCastList.map((actor, index) => <Button onClick={() => navigate("/person/" + actor.personId)} variant={"secondary"} className="pills" key={index}>{actor.personName}</Button>)}
                          <Card.Text className="">
                          </Card.Text>
                        </Card.Body>
                    </Card>
                  </div>
                  
                  {/* row for writers */}
                  <div className="p-2">
                    <Card className="card-no-margin">
                        <Card.Body>
                          <h5>Writers</h5>
                          {title.writersList.map((writer, index) => <Button onClick={() => navigate("/person/" + writer.personId)} variant={"secondary"} className="pills" key={index}>{writer.personName}</Button>)}
                          <Card.Text className="">
                          </Card.Text>
                        </Card.Body>
                    </Card>
                  </div>

                  {/* row for directors */}
                  <div className="p-2">
                    <Card className="card-no-margin">
                        <Card.Body>
                          <h5>Directors</h5>
                          {title.directorsList.map((director, index) => <Button onClick={() => navigate("/person/" + director.personId)} variant={"secondary"} className="pills" key={index}>{director.personName}</Button>)}
                          <Card.Text className="">
                          </Card.Text>
                        </Card.Body>
                    </Card>
                  </div>
                </Stack>
              </Col>
              
              {/* column genre, and rate movie button */}
              <Col xs={2}>
                <Card className="genre-box">
                      <Card.Body>
                        <h5>Genres</h5>
                          {title.genresList.map((genre, index) => <Badge bg="secondary" className="pills" key={index}>{genre}</Badge>)}
                      </Card.Body>
                </Card>
                  <Card className="rate-movie-box" onClick={() => handleShowRatingModal()}>
                    <Card.Body>
                      {hasRated ? "Update your rating" : "Rate movie"}
                    </Card.Body>
                  </Card>
              </Col>
            </Row>
          </Container>

        {similarMovies && 
          <Container fluid="true">
            <div style={{textAlign: 'left'}}>
              <h1>Similar movies</h1>
              <Row md={3}>
                {similarMovies?.map((item) =>   
                  <div key={item.primaryTitle}>
                      <TitleSearchCard title={item} key={item.titleId}/>
                      {item?.genres?.map((genre) => 
                        <div style={{display: "inline", marginLeft: "3px"}} key={genre}>
                          <Badge bg="secondary" className="pills">{genre}</Badge>
                        </div>
                      )}
                  </div>)
                }     
            </Row>
          </div>
          </Container>
        }
          
        {showRatingModal &&      
          <div className="modal show" style={{ display: 'block', position: 'fixed', marginTop: "300px" }}>
            <Modal.Dialog >
              <Modal.Header closeButton onClick={() => CloseRatingModal()}>
                <Modal.Title>Rate {title.primaryTitle}</Modal.Title>
              </Modal.Header>
      
              <Modal.Body>
                {list.map((id) => (hoverRating >= id || (0 > hoverRating && rating >= id)) ?
                <i className="bi bi-star-fill rate-star" key={id} onClick={() => setRating(id)} onMouseEnter={() => setHoverRating(id)} onMouseLeave={() => setHoverRating(-1)}></i> : 
                <i className="bi bi-star rate-star" key={id} onMouseEnter={() => setHoverRating(id)} onMouseLeave={() => setHoverRating(-1)}></i>)}
              </Modal.Body>
      
              <Modal.Footer>
                <Button variant="secondary" onClick={() => CloseRatingModal()}>Cancel</Button>
                <Button disabled={rating >= 0 && rating !== prevRating ? false : true } variant="primary" onClick={() => RateMovie()}>{hasRated ? "Update Rating" : "Save Rating"}</Button>
                <Button variant="danger" style = {{display: !hasRated? "none" : "inline-block"}} onClick={() => RemoveRating()}> Remove Rating </Button> 
              </Modal.Footer>
              </Modal.Dialog>
            </div>
          }

          {showBookmarkModal &&      
            <div className="modal show" style={{ display: 'block', marginTop: "10%" }}>
              <Modal.Dialog>
                <Modal.Header closeButton onClick={() => CloseBookmarkModal()}>
                  <Modal.Title>Bookmark: {title.primaryTitle}</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                      <textarea 
                          value={isBookmarked.annotation}
                          onChange={(e) => handleAnnotationChange(e)}                  
                          rows="3"
                          style={{width: "100%"}}
                          autoFocus
                      />
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={() => CloseBookmarkModal()}>Cancel</Button>
                  <Button disabled={prevAnnotation === annotation ? true : false} variant="primary" onClick={() => updateAnnotation()}>Update</Button>
                </Modal.Footer>
              </Modal.Dialog>
            </div>
          }

        <Toaster header={"Not authorized"} body={"Your are not logged in."} show={showNotLoggedIn} color={"warning"}></Toaster>
        <Toaster header={"Removed"} body={"Your have removed this bookmark."} show={showRemoveBookmarkPop} color={"danger"}></Toaster>        
        <Toaster header={"Success"} body={"Your have bookmarked this title."} show={showBookmarkPop} color={"success"}></Toaster>
        <Toaster header={"Success"} body={"Your have updated the bookmarked for this title."} show={showUpdateBookmarkPop} color={"success"}></Toaster>
        <Toaster header={"Success"} body={toastMessage} show={showRatingPop} color={"success"}></Toaster>

      </div>
    );
  }

}
