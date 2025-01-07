import {GetAllRatings} from '../../Service/RatingService';
import {useEffect, useState} from 'react';
import RatingCard from '../../Component/RatingComponents/RatingCard';
import {useUser} from '../../Store/Store';
import {useNavigate} from 'react-router';
import Alert from 'react-bootstrap/Alert';
import {Container, Row} from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import TitlePlaceholder from '../../Component/TitleComponents/TitlePlaceholder';
import Pagination from 'react-bootstrap/Pagination';

export default function UserRating(){
    const [userRatings, setUserRatings] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timer, setTimer] = useState(5); //Used throughout the whole application - same number, could be passed from Store.js

    //this sorting feature exists only on the frontend- ideally this would be performed on the backend due to pagination.
    const [sortingOrder, setSortingOrder] = useState("rating"); //Sort order will default to rating
    const [descending, setDescending] = useState(true); //will default to descending sort order
    const [page, setPage] = useState(0); //The page we are on
    const [totalPages, setTotalPages] = useState(1) //number of pages in total, we will set state to value recieved from backend
    const [pagenationItems, setPagenationItems] = useState([]); //State is containing the Pagenation components, that is filled below 
    
    const pageSize = 5; //For now, hard-backed.

    let navigate = useNavigate();

    const {userName, logout} = useUser();
    
    const queryParams = { 
        page: page,  
        pageSize: pageSize  
    };

    useEffect(() =>{
        const fetchRatings = async () => {

            const ratings = await GetAllRatings(queryParams);
         
            if(ratings.success){
                setUserRatings(ratings.data.entities);
                setTotalPages(ratings.data.numberOfPages);
                
                sortRatingsHandler(sortingOrder);
                setIsLoading(false); //When state is true, then "loading" is shown in UI
            }
            else {
                setIsLoading(false);
                switch (ratings.message) {
                    case "401":
                        setErrorMessage("401");
                        break;
                
                    default:
                        break;
                }
            }
        }
        fetchRatings();
    }, [page]);

    useEffect(() =>{ //Effect for Rating pagenation

        const items = [];
              
        for (let number = 0; number <= totalPages-1; number++) {
            items.push(
                <Pagination.Item
                key={number}
                active={number === page}
                onClick={() => handlePageChange(number)}
                >
                {number+1} {/* Plus 1, as page starts at 0, we want to display 1 to user*/}
                </Pagination.Item>
            );
        }
        setPagenationItems(items);  
    }, [totalPages, page]);

    const handlePageChange = (page) => {
        setPage(page);
    };

    useEffect(() => {
        let countDown;
        if (errorMessage === "401") {
            const cookieExpired = true;
                countDown = setInterval(() => {
                    setTimer((t) => {
                        if(t <=0){
                            clearInterval(countDown); //This is unnecesary, as useEffect cleanUp function handles the clearInterval
                            logout(cookieExpired);
                            return 0; //timer state is set to 0
                        }
                        console.log("t er: " + t)
                        return t - 1; //aka subtract 1 sec from timer
                    })
                }, 1000);  
        }    
        
        return () => clearInterval(countDown); //Stops timer from continuing to run, after useEffect has executed   

    }, [errorMessage]);
   
    const sortRatingsHandler = (order) => {            
        setSortingOrder(order); //changes the default value of sortingOrder, to the specified order sortingRatingHandler receives
        setUserRatings((prev) => {
            const ratingsSorted =[...prev]; //We create shallow copy of userRatings array, so we can update state
            switch (order) {
                case "rating":
                    return ratingsSorted.sort((a,b) => descending ? b.rating - a.rating : a.rating - b.rating); //Sorts userRatings in descending order by default, otherwise ascending
                    
                case "title":
                    return ratingsSorted.sort((a,b) => {
                    const titleA = a.primaryTitle.toUpperCase();
                    const titleB = b.primaryTitle.toUpperCase();
                    
                    if(descending){ //descending order
                        if(titleB < titleA){
                            return -1;
                        } else if (titleB > titleA){
                            return 1;
                        } else {
                            return 0;
                        }
                    } else {
                        //Ascending order
                        if(titleA < titleB){
                            return -1;
                        }
                        else if (titleA > titleB){
                            return 1;
                        } else {
                        return 0;
                        }
                    }
                });

                case "createdAt" : 
                    return ratingsSorted.sort((a,b) => {
                        const titleA = a.createdAt.toUpperCase();
                        const titleB = b.createdAt.toUpperCase();

                        if(descending){ //descending order
                            if(titleB < titleA){
                                return -1;
                            } else if (titleB > titleA){
                                return 1;
                            } else {
                                return 0;
                            }
                        } else {
                            //Ascending order
                        if(titleA < titleB){
                            return -1;
                        }
                        else if (titleA > titleB){
                            return 1;
                        } else {
                            return 0;
                        }
                        }

                    }
                );
                    
                default:
                    console.log("failed to do sorting order for ratings.."); //No, default happens when no case was matched.
                    break;
            } 
        })      
            
    }
    useEffect(() => { //Each time descending state update, calls sortRatingsHandler and sorts result again
        sortRatingsHandler(sortingOrder);    
    },[descending])

    return (
        <>
            {isLoading && 
                <Container>
                    <h1>Ratings are being loaded...</h1>
                    <Row xs={1} md={4}>
                        <TitlePlaceholder/>
                        <TitlePlaceholder/>
                        <TitlePlaceholder/>
                        <TitlePlaceholder/> 
                    </Row>
                </Container>}
     
            {!isLoading && errorMessage !== "401" && 
    
                <Container>
                    <h1>Ratings for user: {userName}</h1>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {`Sort by ${sortingOrder}`}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Header>Click on sorting option</Dropdown.Header>
                            <Dropdown.Item onClick={() => sortRatingsHandler("rating")}>Rating</Dropdown.Item>
                            <Dropdown.Item onClick={() => sortRatingsHandler("title")}>Title name</Dropdown.Item>
                            <Dropdown.Item onClick={() => sortRatingsHandler("createdAt")}>Created at</Dropdown.Item>
                        </Dropdown.Menu>
                        <Button variant="primary" onClick={() =>{
                                setDescending((prev) => !prev);//Reverses the Descending state
                                
                            }}>Order: {descending ? "descending" : "ascending"}</Button> 
                    </Dropdown>
                    <Row xs={1} md={4}> 
                        {userRatings.map((u, i) => <RatingCard key={i} {...u} />)}
                    </Row>
                    <Row>
                        <div>
                            <Pagination>{pagenationItems}</Pagination>
                            <br/>
                        </div> 
                    </Row>
                </Container>}

            {!isLoading && errorMessage === "401" &&
                <Alert key={"danger"} variant={"danger"}>
                    Warning! You are not logged in! {" " /* Adds a space between text and "Click here"*/}
                    <Alert.Link onClick={() => navigate("/login")}>{"Click here"}</Alert.Link>. if not redirected within {timer== 1 ? `${timer} second` : `${timer} seconds` }
                </Alert> 
            } 
        </>
    );
}
