import {GetAllRatings} from '../Service/RatingService';
import { useEffect, useState } from 'react';
import { GetTitle } from "../Service/TitleService";
import Rating from '../Component/Rating';
import { useUser } from '../Store/store';
import { useNavigate } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import {Container, Row} from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import TitlePlaceholder from '../Component/TitlePlaceholder';

export default function UserRating(){
    const [userRatings, setUserRatings] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timer, setTimer] = useState(5);
    const [sortingOrder, setSortingOrder] = useState("rating"); //Sort order will default to rating
    const [descending, setDescending] = useState(true); //will default to descending sort order

    let navigate = useNavigate();

    const {userName} = useUser();
    
    const queryParams = //Used for pagenation, we send these queryParams when fetching ratings in RatingService
    { page: '0', 
      pageSize: '5' 
    };

    useEffect(() =>{
        const fetchRatings = async () => {

            const ratings = await GetAllRatings(queryParams);
         
            if(ratings.success){
                console.log("Have ratings");
                setUserRatings(ratings.data.entities);
                sortRatingsHandler(sortingOrder);
                setIsLoading(false); //should not render "loading" in UI when rating fetch is successful
            }
            else {
                console.log("Have NO ratings");
                setIsLoading(false);
                switch (ratings.message) {
                    case "401":
                        setErrorMessage("401");
                        //navigate("/login");
                        break;
                
                    default:
                        break;
                }
            }
        }
        fetchRatings();
    }, []);

    useEffect(() => {
        let countDown;
        const errorCodeHandler = () => {
            if (errorMessage === "401") {
                console.log("Unauthorized. We redirect in 5 sec my friend");
               // setTimeout(() => {navigate("/login")}, 5000);  //Needs to be in lambda function, otherwise navigate fires imediately
                 countDown = setInterval(() => {
                    setTimer((t) => {
                        if(t <=0){
                            clearInterval(countDown); //Stops countDown timer from continously running
                            navigate("/login");
                            return 0; //timer state is set to 0
                        }
                        return t - 1; //aka subtract 1 sec from timer
                    })
                }, 1000);  
            }    
        };
        errorCodeHandler(); //Calls the above method, to be used within Effect
        return () => clearInterval(countDown); //Cleanup function, which gets called upon component unmount or change of state    

    }, [errorMessage]);
   
    const sortRatingsHandler = (order) => {
            
        setSortingOrder(order); //changes the default value of sortingOrder, to the specified order sortingRatingHandler receives
        setUserRatings((prev) => {
            const ratingsSorted =[...prev]; //We create shallow copy of userRatings array, so we can update state
            switch (order) {
                case "rating":
                    return ratingsSorted.sort((a,b) => descending ? b.rating - a.rating : a.rating - b.rating); //Sorts userRatings in descending order by default, otherwise ascending
                    
                case "title":
                    return ratingsSorted.sort((a,b) => { //Sorts userRatings in ascending order
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
                   
                
                case "createdAt" : //maybe not good with string uppercase?
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
                    console.log("failed to do sorting order for ratings..");
                    break;
            } 
        })      
            
    }
    useEffect(() => { //Each time descending state update, calls sortRatingsHandler and sorts result again
        sortRatingsHandler(sortingOrder);    
    },[descending])

    console.log(userRatings[0]);

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
        </Container>
        }
     {
    !isLoading && errorMessage !== "401" && 
    
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
        {userRatings.map((u, i) => <Rating key={i} {...u} />)/*need of key?, not currently used in Rating component*/} 
    </Row>
</Container>

     }

      {
   !isLoading && errorMessage === "401" && <Alert key={"danger"} variant={"danger"}>
   Warning!! You are not logged in! <Alert.Link onClick={() => navigate("/login")}>{"Click here"}</Alert.Link>. if not redirected within {timer== 1 ? `${timer} second` : `${timer} seconds` }
   </Alert> //When at 1 sec, write "second" as singular form
     
     }
     </>
     
    );
}
