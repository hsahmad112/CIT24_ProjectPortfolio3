import { useEffect, useState } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from "react-router";
import { GetPersonBackdrop } from '../../Service/PersonService';
import { DeletePersonBookmarksById } from '../../Service/BookmarkService'; //Not used anymore
import { GetHeader } from '../../Store/Store';
import { Trash } from 'react-bootstrap-icons'; 

export default function PersonWatchlistCard({data, onDelete}){
    const [personBookmark, setPersonBookmark] = useState(null); //Person photo state
    const imageUrl = process.env.REACT_APP_TMDB_API_IMAGE_LINK;    
    const navigate = useNavigate();
    let headers = GetHeader(); //not used anymore

    useEffect(() =>{
        const getPersonBookmark = async () => {
            if(data){ //prop
                try {
                    setPersonBookmark((await GetPersonBackdrop(data.personId)));
                } catch (error) {
                    console.log(error);
                }
            }     
        }
        getPersonBookmark();
    }, [data])

    return( //Returns PersonCard containing annotation, name and photo. Used for watchlist
        <Card style={{ width: '16rem', margin: '10px', padding: "0px" }}>
            <Card.Img                     
                variant="top"
                src={personBookmark !== undefined ? imageUrl + personBookmark?.profile_path : "/no-image.jpg"}
                onClick={()=> navigate("/person/" + data.personId)}/>
            <Card.Body>
                <Card.Title>
                    {data.personName}
                </Card.Title>
                <Card.Text>
                    {data.annotation !== "" ? data.annotation : <p style={{color: "lightgrey"}}>No annotation!</p>}
                </Card.Text>
                <ButtonGroup aria-label="Basic example">
                    <Button onClick={()=> navigate("/person/" + data.personId)} variant="primary">Go to person</Button>
                    <Button onClick={() => onDelete(data.personId)} variant="danger">
                        <Trash />
                    </Button>
                </ButtonGroup>
            </Card.Body>             
        </Card>
    );
    

}